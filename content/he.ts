import type { SiteContent } from "./types";

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

export const he: SiteContent = {
  locale: "he",
  dir: "rtl",
  name: "לירז אקסלרד",
  tagline: "Lorem ipsum dolor sit amet",
  homeHref: "/",
  menu: [
    {
      key: "about",
      label: "אודות",
      eyebrow: "אודות",
      title: "קצת עליי",
      body: p1,
      ctaLabel: "הסיפור המלא",
      href: "/about",
      image: "/assets/menu-thumb-about.png",
    },
    {
      key: "blog",
      label: "בלוג",
      eyebrow: "מהכתיבה האחרונה",
      title: "Lorem ipsum dolor sit amet",
      body: p2,
      ctaLabel: "כל הפוסטים",
      href: "/writing",
      image: "/assets/menu-thumb-blog.jpg",
    },
    {
      key: "migration",
      label: "הגירה",
      eyebrow: "הגירה",
      title: "ליווי וצמיחה",
      body: p3,
      ctaLabel: "עוד על הליווי",
      href: "/about",
      image: "/assets/menu-thumb-placeholder.png",
    },
    {
      key: "meditation",
      label: "מדיטציה",
      eyebrow: "מדיטציה",
      title: "MBSR ובודהיזם",
      body: p4,
      ctaLabel: "עוד על התרגול",
      href: "/about",
      image: "/assets/menu-thumb-meditation.png",
    },
    {
      key: "pm",
      label: "ניהול מוצר",
      eyebrow: "ניהול מוצר",
      title: "ליווי אישי",
      body: p1,
      ctaLabel: "עוד על הליווי",
      href: "/about",
      image: "/assets/menu-thumb-placeholder.png",
    },
    {
      key: "support",
      label: "תמיכה",
      eyebrow: "תמיכה",
      title: "צור קשר",
      body: p2,
      ctaLabel: "לטופס יצירת קשר",
      href: "/contact",
      image: "/assets/menu-thumb-support.jpg",
    },
  ],
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
    socials: [
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
    ],
    mirrorHref: "/en",
    mirrorLabel: "English site",
    copyrightText: "© 2026 לירז אקסלרד",
  },
};
