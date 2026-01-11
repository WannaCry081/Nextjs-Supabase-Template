import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/drizzle/db";
import { profiles } from "@/drizzle/schemas";

import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      {
        data: null,
        error: error,
      },
      {
        status: 401,
      }
    );
  }

  const response = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);

  return NextResponse.json(
    {
      data: response[0] ?? null,
    },
    { status: 200 }
  );
}
