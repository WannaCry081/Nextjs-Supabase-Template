import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest, protectedRoutes: string[]) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          const supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;
  const pathname = request.nextUrl.pathname;

  const matchesRoute = (pattern: string, pathname: string) => {
    // Support wildcard patterns like "/dashboard/*" which should match
    // both "/dashboard" and any nested path like "/dashboard/settings".
    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -2);
      return pathname === base || pathname.startsWith(`${base}/`);
    }

    // Exact or prefix match for non-wildcard patterns
    return pathname === pattern || pathname.startsWith(`${pattern}/`);
  };

  const isProtected = protectedRoutes.some((pattern) => matchesRoute(pattern, pathname));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();

    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);

    return NextResponse.redirect(url);
  }

  return response;
}
