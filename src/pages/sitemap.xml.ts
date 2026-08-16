import type { APIRoute } from "astro";
import { he } from "../data/site.he";
import { en } from "../data/site.en";

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.href ?? "https://lirazaxelrad.com/").replace(/\/$/, "");

  const heRoutes = ["", "/about", "/writing", "/contact", ...he.writing.posts.map((p) => `/writing/${p.slug}`)];
  const enRoutes = [
    "/en",
    "/en/about",
    "/en/writing",
    "/en/contact",
    ...en.writing.posts.map((p) => `/en/writing/${p.slug}`),
  ];

  const urls = [...heRoutes, ...enRoutes];
  const lastmod = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;

  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
