import { Fragment } from 'react';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  badges?: string;
  children?: ReactNode;
};

export function TimelineItem({ title, badges, children }: Props) {
  const badgeList = badges
    ? badges
        .split('|')
        .map((b) => b.trim())
        .filter(Boolean)
    : [];

  return (
    <li className="not-prose relative pl-8">
      <span className="bg-border ring-background absolute top-1.5 -left-3.75 flex size-3 items-center justify-center rounded-full ring-2">
        <span className="bg-muted-foreground size-1.5 rounded-full" />
      </span>

      <div className="flex flex-col gap-0.5">
        <span className="leading-snug font-semibold">{title}</span>

        {badgeList.length > 0 && (
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-sm">
            {badgeList.map((badge, i) => (
              <Fragment key={i}>
                {i > 0 && <span aria-hidden="true">·</span>}
                <span>{badge}</span>
              </Fragment>
            ))}
          </div>
        )}

        {children && (
          <div className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            {children}
          </div>
        )}
      </div>
    </li>
  );
}
