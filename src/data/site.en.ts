import type { SiteDataWithWriting } from "./types";

// Independent English content — not a translation of site.he.ts.

const p1 =
  "Anything relevant to you in this site? If you want to talk PM mentoring, Meditation and well-being, immigration and its challenges or explore Berlin together, get in touch. Will schedule an appointment. If there is chemistry we can talk further. First talk is free.";

export const en: SiteDataWithWriting = {
  locale: "en",
  dir: "ltr",
  name: "Liraz Axelrad",
  tagline: "Product Management, Meditation: Mentoring & Teaching",
  description: "Liraz Axelrad — product management, meditation, and life in Berlin",
  homeHref: "/en",
  writing: {
    title: "Posts",
    subtitle: "Instead of a blog, posts I've published in other outlets",
    allPostsLabel: "All posts",
    readMoreLabel: "Continue reading",
  },
  booking: {
    tabBook: "Book a call",
    tabWrite: "Send a message",
    intro:
      "Pick a time that suits you for a free 30-minute call. I confirm each request personally, so you will hear back from me rather than get an automatic booking.",
    loading: "Loading available times…",
    noSlots: "No open times just now. Send me a message instead and we will find one.",
    pickTime: "Choose a time",
    timeZoneNote: "Times shown in your local time ({zone}).",
    changeSlot: "Change time",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    phone: "Phone",
    phonePlaceholder: "So I can reach you if anything changes",
    topic: "What would you like to talk about?",
    submit: "Request this time",
    sending: "Sending…",
    successTitle: "Request sent",
    successBody:
      "I will confirm by email shortly. Nothing is booked until you hear from me — so please don't put it in your calendar just yet.",
    errorMessage: "That didn't send. Please try again, or use the message tab.",
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
