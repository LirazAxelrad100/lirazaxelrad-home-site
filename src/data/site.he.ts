import type { SiteData } from "./types";

// All body copy below is placeholder Lorem Ipsum — Liraz will supply real
// Hebrew copy per page later. Short structural labels (menu items, form
// field labels, buttons) are real so the UI itself is testable.

const p1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.";
const p2 =
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.";
const p3 =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.";
const p4 =
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate.";

export const he: SiteData = {
  locale: "he",
  dir: "rtl",
  name: "לירז אקסלרד",
  tagline: "Lorem ipsum dolor sit amet",
  description: "לירז אקסלרד — ניהול מוצר, מדיטציה וחיים בברלין",
  homeHref: "/",
  about: {
    title: "קצת עליי",
    intro: [p1, p2, p3],
    whatIDoTitle: "מה שאני עושה",
    whatIDoItems: [
      { title: "מדיטציה — MBSR ובודהיזם", body: p4 },
      { title: "ליווי בניהול מוצר", body: p1 },
      { title: "ליווי וצמיחה", body: p2 },
    ],
    ctaLabel: "רוצים לדבר? צרו קשר",
    ctaHref: "/contact",
  },
  writing: {
    title: "כתיבה",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    allPostsLabel: "כל הפוסטים",
    posts: [
      {
        slug: "post-1",
        title: "Lorem ipsum dolor sit amet consectetur",
        date: "28.07.2026",
        body: [p1, p2, p3, p4],
      },
      {
        slug: "post-2",
        title: "Sed do eiusmod tempor incididunt",
        date: "14.07.2026",
        body: [p2, p3, p4],
      },
      {
        slug: "post-3",
        title: "Ut enim ad minim veniam quis",
        date: "30.06.2026",
        body: [p3, p4, p1],
      },
    ],
  },
  contact: {
    title: "צור קשר",
    intro: p1,
    formLabels: {
      name: "שם",
      namePlaceholder: "השם שלך",
      email: "אימייל",
      emailPlaceholder: "you@example.com",
      topic: "מה מעניין אותך?",
      topicOptions: ["מדיטציה", "ליווי בניהול מוצר", "ליווי וצמיחה / ברלין", "משהו אחר"],
      message: "הודעה",
      messagePlaceholder: "ספרו לי קצת...",
      submit: "שליחה",
      successMessage: "תודה! ההודעה נשלחה בהצלחה.",
      errorMessage: "משהו השתבש. נסו שוב או כתבו ישירות למייל.",
    },
    directEmailLabel: "hello@lirazaxelrad.com",
  },
  footer: {
    email: "hello@lirazaxelrad.com",
    contactLabel: "צור קשר",
    contactHref: "/contact",
    socials: [
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
    ],
    mirrorHref: "/en",
    mirrorLabel: "English site",
    copyrightText: "© 2026 לירז אקסלרד",
  },
};
