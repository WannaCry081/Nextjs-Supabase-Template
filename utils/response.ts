import { NextResponse } from "next/server";

import { getStatusText } from "@/constants/http-status.constant";

interface ApiResponseProp<T> {
  data?: T | null;
  status: number;
  message?: string;
}

export function apiResponse<T>(prop: ApiResponseProp<T>): NextResponse {
  const { data, status, message } = prop;

  const success = status >= 200 && status < 300;
  const error = getStatusText(status);

  return NextResponse.json(
    {
      success,
      data,
      message,
      error,
    },
    { status }
  );
}
