import { apiResponse } from "@/lib/api-response";
import { HttpStatus } from "@/constants/http-status.constant";

/**
 * Health Check API Endpoint
 * Used for monitoring, load balancers, and deployment health checks
 */
export async function GET() {
  try {
    return apiResponse("Ok", HttpStatus.OK);
  } catch (error) {
    console.error("Health check failed: ", error);

    return apiResponse("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
