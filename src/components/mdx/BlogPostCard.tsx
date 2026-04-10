import Link from 'next/link';

import type { BlogPost } from '@/lib/mdx';

type Props = {
  post: BlogPost;
};

export function BlogPostCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group border-border hover:bg-muted/50 block rounded-lg border p-5 no-underline transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg leading-snug font-semibold">{post.title}</h2>
          {post.description && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
              {post.description}
            </p>
          )}
        </div>
        <time className="text-muted-foreground shrink-0 text-sm">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
