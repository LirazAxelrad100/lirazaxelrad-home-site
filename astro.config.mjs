import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "https://lirazaxelrad.com",
  output: "static",
  adapter: vercel(),
  server: { port: 3000 },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
