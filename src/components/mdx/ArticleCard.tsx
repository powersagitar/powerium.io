import Link from 'next/link';

import type { Article } from '@/lib/mdx';

type Props = {
  article: Article;
  urlPrefix: string;
};

export function ArticleCard({ article, urlPrefix }: Props) {
  return (
    <Link
      href={`${urlPrefix}/${article.slug}`}
      className="group border-border hover:bg-muted/50 block rounded-lg border p-5 no-underline transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg leading-snug font-semibold">
            {article.title}
          </h2>
          {article.description && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
              {article.description}
            </p>
          )}
        </div>
        {article.date && (
          <time className="text-muted-foreground shrink-0 text-sm">
            {new Date(article.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        )}
      </div>
    </Link>
  );
}
