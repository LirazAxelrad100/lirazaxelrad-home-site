import type { Metadata } from "next";
import { ContentLayout } from "@/components/ContentLayout";
import { ContactForm } from "@/components/ContactForm";
import { en } from "@/content/en";

export const metadata: Metadata = { title: `${en.contact.title} — ${en.name}` };

export default function ContactPage() {
  const { contact } = en;
  return (
    <ContentLayout content={en}>
      <section className="mx-auto max-w-[640px] px-[6vw] pb-24 pt-16">
        <h1 className="m-0 mb-3.5 font-david-libre text-[clamp(28px,3.5vw,38px)] font-medium">{contact.title}</h1>
        <p className="m-0 mb-10 text-[16px] leading-[1.7] text-text-muted">{contact.intro}</p>

        <ContactForm labels={contact.formLabels} />

        <div className="mt-14 flex flex-wrap gap-7 border-t border-border pt-8">
          <a href={`mailto:${contact.directEmailLabel}`} className="text-[15px] no-underline">
            {contact.directEmailLabel}
          </a>
          {en.footer.socials.map((s) => (
            <a key={s.label} href={s.href} className="text-[15px] no-underline">
              {s.label}
            </a>
          ))}
        </div>
      </section>
    </ContentLayout>
  );
}
