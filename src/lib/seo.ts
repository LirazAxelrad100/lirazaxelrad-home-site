import type { SiteData } from "../data/types";

/** Absolute origin of the site, e.g. "https://lirazaxelrad.com" — schema.org needs absolute URLs. */
export function siteOrigin(site: URL | undefined): string {
  return (site?.origin ?? "https://lirazaxelrad.com").replace(/\/$/, "");
}

/** Google truncates meta descriptions around here, so aim just under it. */
const MAX_DESCRIPTION = 160;

/**
 * Turn a paragraph of Markdown body copy into a clean `<meta name="description">`:
 * strip the Markdown syntax, collapse whitespace, and cut at a word boundary.
 * Falls back to the site-wide description when the text is empty.
 */
export function toDescription(text: string, fallback: string): string {
  const plain = text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> just their text
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) return fallback;
  if (plain.length <= MAX_DESCRIPTION) return plain;

  const cut = plain.slice(0, MAX_DESCRIPTION);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * Every profile that belongs to Liraz, for schema.org `sameAs`. This is the
 * union of both footers on purpose: the English footer deliberately leaves
 * Substack out (the content is Hebrew), but `sameAs` is about proving identity
 * to search engines, not about what's shown on the page.
 */
const PROFILES = [
  "https://www.linkedin.com/in/lirazaxelrad/",
  "https://www.instagram.com/lirazax/",
  "https://www.facebook.com/liraz.axelrad",
  "https://lirazaxelrad.substack.com/",
];

const JOB_TITLE: Record<SiteData["locale"], string> = {
  en: "Product management mentor and meditation teacher",
  he: "מנטורית ניהול מוצר ומורה למדיטציה",
};

/**
 * `ProfilePage` + `Person` for a homepage. This is the piece that lets Google
 * and AI answer engines treat "Liraz Axelrad" as one entity with a role, a
 * location and a set of profiles, instead of as a loose string of words.
 */
export function profilePageSchema(site: SiteData, origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    inLanguage: site.locale,
    mainEntity: {
      "@type": "Person",
      "@id": `${origin}/#liraz`,
      name: site.name,
      alternateName: site.locale === "he" ? "Liraz Axelrad" : "לירז אקסלרד",
      description: site.description,
      jobTitle: JOB_TITLE[site.locale],
      url: `${origin}${site.homeHref}`,
      image: `${origin}/assets/about-liraz.jpeg`,
      email: `mailto:${site.footer.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Berlin", addressCountry: "DE" },
      knowsLanguage: ["he", "en"],
      sameAs: PROFILES,
    },
  };
}

/** `BlogPosting` for a single writing post. */
export function blogPostingSchema(
  {
    title,
    description,
    date,
    url,
    tags,
  }: { title: string; description: string; date: string; url: string; tags: string[] },
  site: SiteData,
  origin: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    inLanguage: site.locale,
    mainEntityOfPage: url,
    url,
    keywords: tags,
    author: { "@type": "Person", "@id": `${origin}/#liraz`, name: site.name },
  };
}

/** `Blog` for the writing index. */
export function blogSchema(site: SiteData, origin: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.writing.title} — ${site.name}`,
    inLanguage: site.locale,
    url,
    author: { "@type": "Person", "@id": `${origin}/#liraz`, name: site.name },
  };
}
