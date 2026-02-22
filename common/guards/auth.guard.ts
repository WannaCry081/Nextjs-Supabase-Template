import { NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";

import { apiResponse } from "@/lib/api-response";
import { getSupabaseServer } from "@/lib/supabase/server";

import { HttpStatus } from "@/constants/http-status.constant";
import { AUTH_ERRORS } from "@/constants/http-error-messages.constant";

export async function requireAuth(): Promise<{
  user: User | null;
  error: NextResponse | null;
}> {
  try {
    const supabase = await getSupabaseServer();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const errorResponse = apiResponse({
        data: authError?.message ?? AUTH_ERRORS.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      });

      return { user: null, error: errorResponse };
    }

    return { user, error: null };
  } catch (error) {
    console.error("Auth verification failed: ", error);

    const errorResponse = apiResponse({
      data: AUTH_ERRORS.UNAUTHORIZED,
      status: HttpStatus.UNAUTHORIZED,
    });

    return { user: null, error: errorResponse };
  }
}
