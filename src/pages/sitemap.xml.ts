import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { he } from "../data/site.he";
import { en } from "../data/site.en";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.href ?? "https://lirazaxelrad.com/").replace(/\/$/, "");

  const menuHe = await getCollection("menuHe");
  const menuEn = await getCollection("menuEn");

  const heRoutes = [
    "",
    ...menuHe.map((entry) => entry.data.href),
    "/writing",
    "/contact",
    ...he.writing.posts.map((p) => `/writing/${p.slug}`),
  ];
  const enRoutes = [
    "/en",
    ...menuEn.map((entry) => entry.data.href),
    "/en/contact",
    ...en.writing.posts.map((p) => `/en/writing/${p.slug}`),
  ];

  const urls = [...new Set([...heRoutes, ...enRoutes])];
  const lastmod = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;

  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
