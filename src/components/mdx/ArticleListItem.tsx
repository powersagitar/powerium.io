import Link from 'next/link';

import type { Article } from '@/lib/mdx';

type Props = {
  article: Article;
  urlPrefix: string;
};

export function ArticleListItem({ article, urlPrefix }: Props) {
  const safeSlug = article.slug
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return (
    <li>
      <Link
        href={`${urlPrefix}/${safeSlug}`}
        className="group flex flex-col gap-1 py-3 no-underline"
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-medium group-hover:underline">
            {article.title}
          </span>
          {article.date && (
            <time
              dateTime={article.date}
              className="text-muted-foreground shrink-0 text-sm"
            >
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
        {article.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {article.description}
          </p>
        )}
      </Link>
    </li>
  );
}
