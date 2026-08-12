import type { Metadata } from "next";
import type { ReactNode } from "react";
import { rubik, davidLibre, heebo } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Liraz Axelrad",
  description: "Liraz Axelrad — product management, meditation, and life in Berlin",
  alternates: { languages: { en: "/en", he: "/" } },
};

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${rubik.variable} ${davidLibre.variable} ${heebo.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
