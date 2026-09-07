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
  booking: {
    tabBook: "לקביעת שיחה",
    tabWrite: "לשליחת הודעה",
    intro:
      "אפשר לבחור זמן שנוח לכם לשיחת היכרות של חצי שעה, ללא עלות. אני מאשרת כל בקשה באופן אישי, כך שתקבלו ממני תשובה ולא אישור אוטומטי.",
    loading: "טוען זמנים פנויים…",
    noSlots: "אין כרגע זמנים פנויים. אפשר לשלוח לי הודעה ונמצא מועד יחד.",
    pickTime: "בחרו זמן",
    timeZoneNote: "הזמנים מוצגים לפי השעון המקומי שלכם ({zone}).",
    changeSlot: "לשינוי הזמן",
    name: "שם",
    namePlaceholder: "השם שלך",
    email: "אימייל",
    emailPlaceholder: "you@example.com",
    phone: "טלפון",
    phonePlaceholder: "כדי שאוכל להשיג אתכם אם משהו משתנה",
    topic: "על מה תרצו לדבר?",
    submit: "לשליחת הבקשה",
    sending: "שולח…",
    successTitle: "הבקשה נשלחה",
    successBody:
      "אאשר במייל בקרוב. עד שתקבלו ממני אישור הפגישה עדיין לא נקבעה — אז עוד לא כדאי להכניס אותה ליומן.",
    errorMessage: "השליחה לא הצליחה. אפשר לנסות שוב, או לעבור ללשונית ההודעה.",
  },
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
