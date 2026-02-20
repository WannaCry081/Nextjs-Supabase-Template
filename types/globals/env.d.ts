namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;

    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
    NEXT_PUBLIC_SITE_URL: string;

    RESEND_API_KEY: string;
    RESEND_EMAIL_FROM: string;
  }
}
