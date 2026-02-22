import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client singleton
 * Use this in client components and browser-side code
 */
let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
  }
  return browserClient;
}

/**
 * Direct export for convenience
 */
export const supabase = getSupabaseClient();
