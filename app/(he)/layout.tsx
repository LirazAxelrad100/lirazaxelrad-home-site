import type { Metadata } from "next";
import type { ReactNode } from "react";
import { rubik, davidLibre, heebo } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "לירז אקסלרד",
  description: "לירז אקסלרד — ניהול מוצר, מדיטציה וחיים בברלין",
  alternates: { languages: { en: "/en", he: "/" } },
};

export default function HebrewLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} ${davidLibre.variable} ${heebo.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
