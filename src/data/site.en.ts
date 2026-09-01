import type { SiteData } from "./types";

// Independent English content — not a translation of site.he.ts.

const p1 =
  "Anything relevant to you in this site? If you want to talk PM mentoring, Meditation and well-being, immigration and its challenges or explore Berlin together, get in touch. Will schedule an appointment. If there is chemistry we can talk further. First talk is free.";

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
      topicPlaceholder: "Select your topic",
      topicOptions: ["Product management mentoring", "Meditation", "Migration", "Scrolling in Berlin"],
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
      { label: "LinkedIn", href: "https://www.linkedin.com/in/lirazaxelrad/" },
      { label: "Instagram", href: "https://www.instagram.com/lirazax/" },
      { label: "Facebook", href: "https://www.facebook.com/liraz.axelrad" },
    ],
    mirrorHref: "/",
    mirrorLabel: "עברית",
    copyrightText: "© 2026 Liraz Axelrad",
  },
};
