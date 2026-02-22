import { NextResponse } from "next/server";

import { getStatusText } from "@/constants/http-status.constant";

/**
 * @param data - Response data or error message
 * @param status - HTTP status code
 * @returns JSON response with success flag, data, and status text
 */
export function apiResponse<T = unknown>({
  data = null,
  status,
}: {
  data: T | null;
  status: number;
}): NextResponse {
  const success = status >= 200 && status < 300;
  const error = getStatusText(status);

  return NextResponse.json(
    {
      success,
      data,
      error,
    },
    { status }
  );
}
