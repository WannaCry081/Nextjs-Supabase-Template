import { z } from "zod";

/**
 * Environment variable validation schema
 * Ensures all required env vars are present and valid at runtime
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required"),

  // Site
  NEXT_PUBLIC_SITE_URL: z
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
    .default("http://localhost:3000"),

  // Resend
  RESEND_API_KEY: z.string().optional(),
  RESEND_EMAIL_FROM: z.email().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates and returns typed environment variables
 * Throws error if validation fails
 */
export function getEnv(): Env {
  try {
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err) => `  - ${err.path.join(".")}: ${err.message}`);

      throw new Error(
        `Invalid environment variables:\n${missingVars.join("\n")}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}

/**
 * Singleton env instance
 * Use this for type-safe access to env vars throughout the app
 */
export const env = getEnv();
