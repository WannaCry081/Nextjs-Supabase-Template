import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NextJS Supabase Template",
  description: "A production-ready Next.js + Supabase starter template",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Docs", link: "/overview" },
      { text: "Visit Page", link: "http://localhost:3000/" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [{ text: "Overview", link: "/overview" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/wannacry081/Nextjs-Supabase-Template" },
    ],
  },
});
