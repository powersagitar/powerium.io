import { getAllBlogPosts } from '@/lib/mdx';

import { BlogPostCard } from './BlogPostCard';

type Props = {
  limit?: number;
};

export function BlogList({ limit }: Props) {
  const posts = getAllBlogPosts().slice(0, limit);

  return (
    <div className="not-prose space-y-4">
      {posts.map((post) => (
        <BlogPostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
