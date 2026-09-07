export type Locale = "he" | "en";
export type Direction = "rtl" | "ltr";

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
  readMoreLabel?: string;
  posts?: WritingPost[];
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
    /** Shown as the pre-selected first option, so no real topic is picked by default. */
    topicPlaceholder: string;
    topicOptions: string[];
    message: string;
    messagePlaceholder: string;
    submit: string;
    successMessage: string;
    errorMessage: string;
  };
  directEmailLabel: string;
}

/** Copy for the "book a call" tab on the contact page. */
export interface BookingContent {
  tabBook: string;
  tabWrite: string;
  intro: string;
  loading: string;
  noSlots: string;
  pickTime: string;
  /** `{zone}` is replaced with the visitor's own timezone. */
  timeZoneNote: string;
  changeSlot: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  topic: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  errorMessage: string;
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

/** A locale that has a writing section — currently English only. */
export type SiteDataWithWriting = SiteData & { writing: WritingListContent };

export interface SiteData {
  locale: Locale;
  dir: Direction;
  name: string;
  tagline: string;
  description: string;
  homeHref: string;
  /** English-only: Hebrew has no writing section. */
  writing?: WritingListContent;
  contact: ContactPageContent;
  booking: BookingContent;
  footer: FooterContent;
}
