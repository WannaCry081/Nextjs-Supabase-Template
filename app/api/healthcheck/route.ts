import { apiResponse } from "@/utils/response";
import { HttpStatus } from "@/constants/http-status.constant";

export async function GET() {
  return apiResponse({
    data: "Ok",
    status: HttpStatus.OK,
  });
}
