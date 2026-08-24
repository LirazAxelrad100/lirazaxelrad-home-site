import type { SiteData } from "./types";

// Independent English content — not a translation of site.he.ts. Body copy
// is placeholder Lorem Ipsum; Liraz will supply real English copy later.

const p1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.";

export const en: SiteData = {
  locale: "en",
  dir: "ltr",
  name: "Liraz Axelrad",
  tagline: "Product Management, Meditation: Mentoring & Teaching",
  description: "Liraz Axelrad — product management, meditation, and life in Berlin",
  homeHref: "/en",
  writing: {
    title: "Writing",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    allPostsLabel: "All posts",
    readMoreLabel: "Continue reading",
  },
  contact: {
    title: "Contact",
    intro: p1,
    formLabels: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      topic: "What are you interested in?",
      topicOptions: ["Meditation", "Product management mentoring", "Migration & growth / Berlin", "Something else"],
      message: "Message",
      messagePlaceholder: "Tell me a bit...",
      submit: "Send",
      successMessage: "Thanks! Your message was sent.",
      errorMessage: "Something went wrong. Please try again or email directly.",
    },
    directEmailLabel: "hello@lirazaxelrad.com",
  },
  footer: {
    email: "hello@lirazaxelrad.com",
    contactLabel: "Contact",
    contactHref: "/en/contact",
    socials: [
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
    ],
    mirrorHref: "/",
    mirrorLabel: "עברית",
    copyrightText: "© 2026 Liraz Axelrad",
  },
};
