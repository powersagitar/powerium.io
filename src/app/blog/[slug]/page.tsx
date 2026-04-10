import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { compileMDX } from 'next-mdx-remote/rsc';

import { mdxComponents } from '@/components/mdx';
import { getBlogFrontmatter, getBlogSlugs, getBlogSource } from '@/lib/mdx';
import { mdxOptions } from '@/lib/mdx-options';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getBlogSlugs();
  if (!slugs.includes(slug)) return {};

  const fm = getBlogFrontmatter(slug);
  return {
    title: fm.title,
    description: fm.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const slugs = getBlogSlugs();
  if (!slugs.includes(slug)) notFound();

  const source = getBlogSource(slug);
  const { content, frontmatter } = await compileMDX<{
    title: string;
    date: string;
    description?: string;
  }>({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions,
    },
  });

  return (
    <article className="prose">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          {frontmatter.title}
        </h1>
        <time className="text-muted-foreground text-sm">
          {frontmatter.date}
        </time>
      </header>
      {content}
    </article>
  );
}
