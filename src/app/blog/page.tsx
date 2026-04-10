import type { Metadata } from 'next';

import { BlogPostCard } from '@/components/mdx/BlogPostCard';
import { getAllBlogPosts } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'All posts.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
