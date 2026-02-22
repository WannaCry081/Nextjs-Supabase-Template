import { NextResponse } from "next/server";

import { getStatusText } from "@/constants/http-status.constant";

/**
 * Base API response function - maximum flexibility
 * @param data - Response data (for success) or error message (for errors)
 * @param status - HTTP status code
 */
export function apiResponse<T = unknown>({
  data = null,
  status,
}: {
  data: T | null;
  status: number;
}): NextResponse {
  // Auto-detect success/error based on status code if not explicitly provided
  const success = status >= 200 && status < 300;

  // Get the error name based on the status code
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
