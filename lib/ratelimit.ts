import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

import { apiResponse } from "@/lib/response";

import { HttpStatus } from "@/constants/http-status.constant";

type RateLimitTier = "api" | "auth" | "email";

const TIER_CONFIG: Record<
  RateLimitTier,
  { tokens: number; window: Parameters<typeof Ratelimit.slidingWindow>[1] }
> = {
  api: { tokens: 20, window: "10s" },
  auth: { tokens: 5, window: "60s" },
  email: { tokens: 3, window: "60s" },
};

const instances = new Map<RateLimitTier, Ratelimit>();

function getRateLimiter(tier: RateLimitTier): Ratelimit {
  let instance = instances.get(tier);
  if (!instance) {
    const { tokens, window } = TIER_CONFIG[tier];
    instance = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(tokens, window),
      analytics: true,
      prefix: "@upstash/ratelimit",
    });
    instances.set(tier, instance);
  }
  return instance;
}

/**
 * Apply rate limiting to an API route. Returns a 429 response if the limit is exceeded,
 * or null if the request is allowed. Gracefully skips when Upstash env vars are not set.
 *
 * Rate limit tiers:
 * - api: General API routes (20 req / 10s)
 * - auth: Auth-sensitive routes like login, register, password reset (5 req / 60s)
 * - email: Email sending (3 req / 60s)
 *
 * @param tier - Which rate limiter to use (api | auth | email)
 * @param identifier - Optional custom identifier (defaults to client IP)
 */
export async function rateLimit(
  tier: RateLimitTier,
  identifier?: string
): Promise<Response | null> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  const id = identifier ?? (await getClientIp());

  const { success, limit, remaining, reset } = await getRateLimiter(tier).limit(id);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);

    return apiResponse({
      data: "Too many requests. Please try again later.",
      status: HttpStatus.TOO_MANY_REQUESTS,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(reset),
      },
    });
  }

  return null;
}

async function getClientIp(): Promise<string> {
  const headersList = await headers();

  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "anonymous"
  );
}
