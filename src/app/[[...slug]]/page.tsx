import type { Metadata } from 'next';

import {
  ContentRenderer,
  generateContentMetadata,
} from '@/components/ContentRenderer';
import { getAllStaticPaths } from '@/lib/mdx';

export const dynamicParams = false;

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  return getAllStaticPaths()
    .filter((s) => s.length > 0)
    .map((s) => ({ slug: s }))
    .concat([{ slug: [] }]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateContentMetadata(slug ?? []);
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  return <ContentRenderer slugParts={slug ?? []} />;
}
