'use client';

import { useEffect, useState } from 'react';

import {
  BlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { NotionHeading } from '@/lib/notion/page';
import { cn } from '@/lib/utils';

import TOCEntries from './entries';

type TOCDesktopProps = {
  headings: NotionHeading[];
};

export default function TOCDesktop({ headings }: TOCDesktopProps) {
  const activeHeading = useActiveHeading(headings);
  const [isTocOpen, setIsTocOpen] = useState(false);

  if (headings.length < 1) {
    return null;
  }

  return (
    <aside className="fixed top-0 right-0 bottom-0 z-50 hidden items-center md:flex">
      {isTocOpen ? (
        <nav
          className="flex max-h-[75vh] max-w-prose flex-col overflow-y-scroll rounded py-3 pr-6 backdrop-blur-sm"
          onMouseLeave={() => setIsTocOpen(false)}
        >
          <TOCEntries activeHeading={activeHeading} headings={headings} />
        </nav>
      ) : (
        <Hint
          notionHeadings={headings}
          activeHeading={activeHeading}
          onMouseEnter={() => setIsTocOpen(true)}
        />
      )}
    </aside>
  );
}

type HintProps = {
  notionHeadings: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
  activeHeading?: BlockObjectResponse['id'];
  onMouseEnter: () => void;
};

function Hint({ notionHeadings, activeHeading, onMouseEnter }: HintProps) {
  return (
    <div className="max-h-[75vh] overflow-y-hidden">
      <div
        className="flex flex-col items-end gap-3 rounded py-2 pr-3 pl-2 backdrop-blur-sm"
        onMouseEnter={onMouseEnter}
      >
        {notionHeadings.map((heading) => (
          <div
            key={'toc-desktop-hint-' + heading.id}
            className={cn('bg-muted h-1 rounded-full transition', {
              'bg-foreground':
                activeHeading !== undefined && activeHeading === heading.id,
              'w-9': heading.type === 'heading_1',
              'w-6': heading.type === 'heading_2',
              'w-3': heading.type === 'heading_3',
            })}
          />
        ))}
      </div>
    </div>
  );
}

function useActiveHeading(headings: NotionHeading[]) {
  const [activeHeading, setActiveHeading] = useState<
    BlockObjectResponse['id'] | undefined
  >(undefined);

  useEffect(() => {
    if (headings.length > 0) {
      setActiveHeading(headings[0].id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -70% 0%' },
    );

    headings.forEach((heading) => {
      // element id is set to be exactly the same as the block id
      const headingElement = document.getElementById(heading.id);
      if (headingElement) {
        observer.observe(headingElement);
      }
    });

    return () =>
      headings.forEach((heading) => {
        const headingElement = document.getElementById(heading.id);
        if (headingElement) {
          observer.unobserve(headingElement);
        }
      });
  }, [headings]);

  return activeHeading;
}
