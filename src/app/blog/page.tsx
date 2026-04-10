import type { Metadata } from 'next';

import { ArticleCard } from '@/components/mdx/ArticleCard';
import { getAllPosts } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'All posts.',
};

export default function BlogPage() {
  const posts = getAllPosts('blog');

  return (
    <div className="prose">
      <h1 id="title" className="mb-8">
        <a href="#title" className="anchor">
          Blog
        </a>
      </h1>
      <div className="not-prose space-y-6">
        {posts.map((post) => (
          <ArticleCard key={post.slug} article={post} urlPrefix="/blog" />
        ))}
      </div>
    </div>
  );
}
