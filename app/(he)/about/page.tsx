import type { Metadata } from "next";
import Link from "next/link";
import { ContentLayout } from "@/components/ContentLayout";
import { he } from "@/content/he";

export const metadata: Metadata = { title: `${he.about.title} — ${he.name}` };

export default function AboutPage() {
  const { about } = he;
  return (
    <ContentLayout content={he}>
      <section className="mx-auto max-w-[640px] px-[6vw] pb-10 pt-16">
        <h1 className="m-0 mb-5 font-david-libre text-[clamp(28px,3.5vw,38px)] font-medium">{about.title}</h1>
        {about.intro.map((paragraph, i) => (
          <p key={i} className="m-0 mb-[18px] text-[17px] leading-[1.85] text-text-body last:mb-0">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="mx-auto max-w-[900px] px-[6vw] pb-24 pt-10">
        <h2 className="m-0 mb-7 font-david-libre text-[24px] font-medium">{about.whatIDoTitle}</h2>
        <div className="flex flex-col gap-7">
          {about.whatIDoItems.map((item) => (
            <div key={item.title}>
              <h3 className="m-0 mb-2 text-[17px]">{item.title}</h3>
              <p className="m-0 text-[15px] leading-[1.75] text-text-body-soft">{item.body}</p>
            </div>
          ))}
        </div>
        <Link href={about.ctaHref} className="mt-9 inline-block text-[15px] font-semibold no-underline">
          {about.ctaLabel} ←
        </Link>
      </section>
    </ContentLayout>
  );
}
