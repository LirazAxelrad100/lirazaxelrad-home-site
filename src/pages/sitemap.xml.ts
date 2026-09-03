import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { allTags } from "../lib/writing";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.href ?? "https://lirazaxelrad.com/").replace(/\/$/, "");

  const menuHe = await getCollection("menuHe");
  const menuEn = await getCollection("menuEn");
  const writingEn = await getCollection("writingEn");

  // Hebrew's /writing pages are deliberately absent: they still hold
  // placeholder copy and are marked noindex, so they don't belong here.
  const heRoutes = ["/", ...menuHe.map((entry) => entry.data.href), "/contact"];
  const enRoutes = [
    "/en",
    ...menuEn.map((entry) => entry.data.href),
    "/en/contact",
    ...writingEn.map((post) => `/en/writing/${post.id}`),
    ...allTags(writingEn).map(({ slug }) => `/en/writing/tag/${slug}`),
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
