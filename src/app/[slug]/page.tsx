import { notFound } from 'next/navigation';

import { compileMDX } from 'next-mdx-remote/rsc';

import { mdxComponents } from '@/components/mdx';
import { getPageSlugs, getPageSource } from '@/lib/mdx';
import { mdxOptions } from '@/lib/mdx-options';

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPageSlugs().map((slug) => ({ slug }));
}

export default async function GenericPage({ params }: Props) {
  const { slug } = await params;
  const slugs = getPageSlugs();
  if (!slugs.includes(slug)) notFound();

  const source = getPageSource(slug);
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: { mdxOptions },
  });

  return <div className="prose">{content}</div>;
}
