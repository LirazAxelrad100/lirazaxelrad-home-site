import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://lirazaxelrad.com",
  output: "static",
  trailingSlash: "never",
  // Old WordPress URLs that are still in Google's index. A 301 hands their
  // ranking to the page that replaced them instead of throwing it away.
  // Both slash forms are listed because Google indexed the trailing-slash one.
  redirects: {
    "/about-me": "/about",
    "/about-me/": "/about",
    "/mbsr": "/meditation",
    "/mbsr/": "/meditation",
  },
  adapter: vercel(),
  server: { port: 3000 },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
