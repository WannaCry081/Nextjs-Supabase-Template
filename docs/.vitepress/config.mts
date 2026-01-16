import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NextJS Supabase Template",
  description: "A production-ready Next.js + Supabase starter template",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Docs", link: "/" },
      { text: "Visit Page", link: "http://localhost:3000/" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [{ text: "Getting Started", link: "/getting-started" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/wannacry081/Nextjs-Supabase-Template" },
    ],
  },
});
