import { apiResponse } from "@/lib/response";
import { HttpStatus } from "@/constants/http-status.constant";

export async function GET() {
  return apiResponse({
    data: "Ok",
    status: HttpStatus.OK,
  });
}
