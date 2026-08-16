import type { SiteData } from "./types";

// Independent English content — not a translation of site.he.ts. Body copy
// is placeholder Lorem Ipsum; Liraz will supply real English copy later.

const p1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.";
const p2 =
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.";
const p3 =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.";
const p4 =
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate.";

export const en: SiteData = {
  locale: "en",
  dir: "ltr",
  name: "Liraz Axelrad",
  tagline: "Lorem ipsum dolor sit amet",
  description: "Liraz Axelrad — product management, meditation, and life in Berlin",
  homeHref: "/en",
  about: {
    title: "A bit about me",
    intro: [p1, p2, p3],
    whatIDoTitle: "What I do",
    whatIDoItems: [
      { title: "Product Management Mentoring", body: p4 },
      { title: "Meditation — MBSR & Buddhism", body: p1 },
      { title: "Support & Growth", body: p2 },
    ],
    ctaLabel: "Want to talk? Get in touch",
    ctaHref: "/en/contact",
  },
  writing: {
    title: "Writing",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    allPostsLabel: "All posts",
    posts: [
      {
        slug: "post-1",
        title: "Lorem ipsum dolor sit amet consectetur",
        date: "2026-07-28",
        body: [p1, p2, p3, p4],
      },
      {
        slug: "post-2",
        title: "Sed do eiusmod tempor incididunt",
        date: "2026-07-14",
        body: [p2, p3, p4],
      },
      {
        slug: "post-3",
        title: "Ut enim ad minim veniam quis",
        date: "2026-06-30",
        body: [p3, p4, p1],
      },
    ],
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
