export type Locale = "he" | "en";
export type Direction = "rtl" | "ltr";

export interface AboutPageContent {
  title: string;
  intro: string[];
  whatIDoTitle: string;
  whatIDoItems: { title: string; body: string }[];
  ctaLabel: string;
  ctaHref: string;
}

export interface WritingPost {
  slug: string;
  title: string;
  date: string;
  body: string[];
}

export interface WritingListContent {
  title: string;
  subtitle: string;
  allPostsLabel: string;
  posts: WritingPost[];
}

export interface ContactPageContent {
  title: string;
  intro: string;
  formLabels: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    topic: string;
    topicOptions: string[];
    message: string;
    messagePlaceholder: string;
    submit: string;
    successMessage: string;
    errorMessage: string;
  };
  directEmailLabel: string;
}

export interface FooterContent {
  email: string;
  contactLabel: string;
  contactHref: string;
  socials: { label: string; href: string }[];
  mirrorHref: string;
  mirrorLabel: string;
  copyrightText: string;
}

export interface MenuItem {
  key: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
}

export interface SiteData {
  locale: Locale;
  dir: Direction;
  name: string;
  tagline: string;
  description: string;
  homeHref: string;
  about: AboutPageContent;
  writing: WritingListContent;
  contact: ContactPageContent;
  footer: FooterContent;
}
