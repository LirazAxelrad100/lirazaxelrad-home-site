import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const menuSchema = z.object({
  order: z.number(),
  label: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  ctaLabel: z.string(),
  href: z.string(),
  image: z.string().optional(),
});

const writingSchema = z.object({
  title: z.string(),
  date: z.string(),
  tags: z.array(z.string()).default([]),
});

export const collections = {
  menuHe: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/menu/he" }),
    schema: menuSchema,
  }),
  menuEn: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/menu/en" }),
    schema: menuSchema,
  }),
  writingEn: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/writing/en" }),
    schema: writingSchema,
  }),
};
