import { compileMDX } from 'next-mdx-remote/rsc';

import { mdxComponents } from '@/components/mdx';
import { getPageSource } from '@/lib/mdx';
import { mdxOptions } from '@/lib/mdx-options';

export default async function HomePage() {
  const source = getPageSource('home');
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: { mdxOptions },
  });

  return <div className="prose">{content}</div>;
}
