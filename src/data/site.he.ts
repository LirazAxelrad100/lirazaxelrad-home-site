import type { SiteData } from "./types";

// Page copy lives in the menu content collection; what's left here is the
// name/tagline, the contact page and the footer — all real copy.

const contactIntro =
  "לבדיקת אפשרות של עבודה ביחד, על כל אחד מהנושאים - ניהול מוצר, מדיטציה, הגירה, ביקור בברלין - צרו קשר ונקבע שיחה ונבדוק אם יש התאמה ועניין ורצון להמשיך. שיחה ראשונה, חצי שעה, חינם.";

export const he: SiteData = {
  locale: "he",
  dir: "rtl",
  name: "לירז אקסלרד",
  tagline: "ניהול מוצר, מדיטציה, הגירה: ליווי ותמיכה",
  description: "לירז אקסלרד — ניהול מוצר, מדיטציה וחיים בברלין",
  homeHref: "/",
  contact: {
    title: "צרו קשר",
    intro: contactIntro,
    formLabels: {
      name: "שם",
      namePlaceholder: "השם שלך",
      email: "אימייל",
      emailPlaceholder: "you@example.com",
      topic: "מה מעניין אותך?",
      topicPlaceholder: "באיזה עניין?",
      topicOptions: ["מדיטציה", "ניהול מוצר", "!ברלין, ברלין", "הגירה"],
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
    contactLabel: "צרו קשר",
    contactHref: "/contact",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/lirazaxelrad/" },
      { label: "Instagram", href: "https://www.instagram.com/lirazax/" },
      { label: "Facebook", href: "https://www.facebook.com/liraz.axelrad" },
      { label: "Substack", href: "https://lirazaxelrad.substack.com/" },
    ],
    mirrorHref: "/en",
    mirrorLabel: "English site",
    copyrightText: "© 2026 לירז אקסלרד",
  },
};
