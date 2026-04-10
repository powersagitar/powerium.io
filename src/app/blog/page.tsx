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
    <div className="prose">
      <h1 id="title" className="mb-8">
        <a href="#title" className="anchor">
          Blog
        </a>
      </h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
