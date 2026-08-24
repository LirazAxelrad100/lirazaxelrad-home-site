import type { CollectionEntry } from "astro:content";

export function sortPostsByDateDesc(entries: CollectionEntry<"writingEn">[]): CollectionEntry<"writingEn">[] {
  return [...entries].sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function allTags(entries: CollectionEntry<"writingEn">[]): { slug: string; label: string }[] {
  const bySlug = new Map<string, string>();
  for (const entry of entries) {
    for (const tag of entry.data.tags) {
      const slug = slugifyTag(tag);
      if (!bySlug.has(slug)) bySlug.set(slug, tag);
    }
  }
  return [...bySlug.entries()].map(([slug, label]) => ({ slug, label }));
}
