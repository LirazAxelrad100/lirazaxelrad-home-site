import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentLayout } from "@/components/ContentLayout";
import { he } from "@/content/he";

export function generateStaticParams() {
  return he.writing.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = he.writing.posts.find((p) => p.slug === slug);
  return { title: post ? `${post.title} — ${he.name}` : he.name };
}

export default async function WritingPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = he.writing.posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <ContentLayout content={he}>
      <article className="mx-auto max-w-[680px] px-[6vw] pb-24 pt-14">
        <Link href="/writing" className="text-[14px] no-underline">
          → {he.writing.allPostsLabel}
        </Link>
        <div className="mb-2.5 mt-6 text-[13px] tracking-[0.5px] text-accent">{post.date}</div>
        <h1 className="m-0 mb-8 font-david-libre text-[clamp(28px,4vw,40px)] font-medium leading-[1.3]">
          {post.title}
        </h1>
        <div className="text-[18px] leading-[1.9] text-text-body">
          {post.body.map((paragraph, i) => (
            <p key={i} className="m-0 mb-[22px] last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </ContentLayout>
  );
}
