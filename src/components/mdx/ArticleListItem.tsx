import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

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

  const dirLabel = urlPrefix.replace(/^\//, '');
  const date = article['publish-date']
    ? new Date(article['publish-date']).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <li className="flex">
      <Link
        href={`${urlPrefix}/${safeSlug}`}
        className="group border-border bg-card text-foreground hover:border-foreground/30 flex min-h-33 flex-1 flex-col gap-2.5 rounded-[10px] border px-4.5 pt-4 pb-3.5 no-underline shadow-[0_1px_2px_0_rgb(0_0_0/0.03)] transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-px hover:shadow-[0_4px_14px_-6px_rgb(0_0_0/0.10),0_1px_2px_rgb(0_0_0/0.04)]"
      >
        {/* kicker — dir/slug in mono */}
        <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-[11px] tracking-[-0.01em]">
          <span className="opacity-65">{dirLabel}/</span>
          <span
            style={{
              color:
                'color-mix(in oklab, var(--muted-foreground) 70%, var(--foreground))',
            }}
          >
            {article.slug}
          </span>
          <span className="flex-1" />
          <span className="bg-border group-hover:bg-foreground size-1.25 rounded-full transition-colors duration-150" />
        </div>

        {/* title */}
        <div className="text-base leading-[1.35] font-semibold tracking-[-0.01em]">
          {article.title}
        </div>

        {/* description */}
        {article.description && (
          <p className="text-muted-foreground m-0 line-clamp-3 text-[13.5px] leading-[1.55]">
            {article.description}
          </p>
        )}

        <div className="flex-1" />

        {/* footer — date + read arrow */}
        <div className="border-border mt-1 flex items-center justify-between border-t border-dashed pt-2.5">
          {date ? (
            <time
              dateTime={article['publish-date']!}
              className="text-muted-foreground font-mono text-xs"
            >
              {date}
            </time>
          ) : (
            <span />
          )}
          <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1 text-xs font-medium transition-colors duration-150">
            Read
            <span className="inline-flex transition-transform duration-150 group-hover:translate-x-0.5">
              <ArrowRight size={12} />
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}
