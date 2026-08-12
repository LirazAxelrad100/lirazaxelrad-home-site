import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { SiteContent } from "@/content/types";

interface ContentLayoutProps {
  content: SiteContent;
  children: ReactNode;
}

export function ContentLayout({ content, children }: ContentLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col font-heebo">
      <Header name={content.name} tagline={content.tagline} homeHref={content.homeHref} />
      <main className="flex-1">{children}</main>
      <Footer nameLabel={content.name} footer={content.footer} />
    </div>
  );
}
