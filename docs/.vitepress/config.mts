import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NextJS Supabase Template",
  description: "A production-ready Next.js + Supabase starter template",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Docs", link: "/overview" },
      { text: "Visit Page", link: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [{ text: "Overview", link: "/overview" }],
      },
      {
        text: "Architecture",
        items: [
          { text: "Pattern Guide", link: "/patterns/" },
          { text: "API Response", link: "/patterns/api-response" },
          { text: "Auth Guard Pattern", link: "/patterns/auth-guard" },
          { text: "Form Validation", link: "/patterns/form-validation" },
          { text: "Route Definitions", link: "/patterns/routes" },
          { text: "Query Keys", link: "/patterns/query-keys" },
          { text: "HTTP Status", link: "/patterns/http-status" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/wannacry081/Nextjs-Supabase-Template" },
    ],
  },
});
