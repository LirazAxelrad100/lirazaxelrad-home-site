import type { CollectionEntry } from "astro:content";
import type { MenuItem } from "../data/types";

export function splitParagraphs(body: string): string[] {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function firstParagraph(body: string): string {
  return splitParagraphs(body)[0] ?? "";
}

export function buildMenuItems(entries: CollectionEntry<"menuHe" | "menuEn">[]): MenuItem[] {
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({
      key: entry.id,
      label: entry.data.label,
      eyebrow: entry.data.eyebrow,
      title: entry.data.title,
      ctaLabel: entry.data.ctaLabel,
      href: entry.data.href,
      body: firstParagraph(entry.body ?? ""),
    }));
}
