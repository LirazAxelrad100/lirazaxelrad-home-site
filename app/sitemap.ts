import type { MetadataRoute } from "next";
import { he } from "@/content/he";
import { en } from "@/content/en";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lirazaxelrad.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const heRoutes = ["", "/about", "/writing", "/contact", ...he.writing.posts.map((p) => `/writing/${p.slug}`)];
  const enRoutes = [
    "/en",
    "/en/about",
    "/en/writing",
    "/en/contact",
    ...en.writing.posts.map((p) => `/en/writing/${p.slug}`),
  ];

  return [...heRoutes, ...enRoutes].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));
}
