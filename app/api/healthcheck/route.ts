import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";

import { HttpStatus } from "@/constants/http-status.constant";

export async function GET() {
  const rateLimited = await rateLimit("api");
  if (rateLimited) return rateLimited;

  return apiResponse({
    data: "Ok",
    status: HttpStatus.OK,
  });
}
