import type { Metadata } from "next";
import Link from "next/link";
import { ContentLayout } from "@/components/ContentLayout";
import { he } from "@/content/he";

export const metadata: Metadata = { title: `${he.writing.title} — ${he.name}` };

export default function WritingListPage() {
  const { writing } = he;
  return (
    <ContentLayout content={he}>
      <section className="mx-auto max-w-[760px] px-[6vw] pb-8 pt-16">
        <h1 className="m-0 mb-3 font-david-libre text-[clamp(28px,3.5vw,38px)] font-medium">{writing.title}</h1>
        <p className="m-0 text-[16px] text-text-muted">{writing.subtitle}</p>
      </section>

      <section className="mx-auto max-w-[760px] px-[6vw] pb-24 pt-5">
        <div className="flex flex-col">
          {writing.posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="flex items-center justify-between gap-6 border-b border-border py-[22px] text-inherit no-underline hover:text-accent"
            >
              <span className="text-[18px]">{post.title}</span>
              <span className="whitespace-nowrap text-[14px] text-text-muted-soft">{post.date}</span>
            </Link>
          ))}
        </div>
      </section>
    </ContentLayout>
  );
}
