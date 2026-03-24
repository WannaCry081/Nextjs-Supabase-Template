import { apiResponse } from "@/utils/response";

import { HttpStatus } from "@/constants/http-status.constant";

export async function GET() {
  try {
    return apiResponse({
      data: "Ok",
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Health check failed: ", error);

    return apiResponse({
      data: "Internal Server Error",
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
