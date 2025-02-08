'use client';

import { useContext, useEffect, useState } from 'react';

import {
  BlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { cn } from '@/lib/utils';

import { NotionHeadingsContext } from '../contexts/notion-headings';
import TOCEntries from './entries';

export default function TOCDesktop() {
  const { notionHeadings } = useContext(NotionHeadingsContext);

  const activeHeading = useActiveHeading();
  const [isTocOpen, setIsTocOpen] = useState(false);

  if (notionHeadings.length < 1) {
    return null;
  }

  return (
    <aside className="fixed top-0 right-0 bottom-0 z-50 hidden items-center md:flex">
      {isTocOpen ? (
        <nav
          className="flex max-h-[75vh] max-w-prose flex-col overflow-y-scroll rounded py-3 pr-6 backdrop-blur-sm"
          onMouseLeave={() => setIsTocOpen(false)}
        >
          <TOCEntries activeHeading={activeHeading} />
        </nav>
      ) : (
        <Hint
          notionHeadings={notionHeadings}
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

function useActiveHeading() {
  const { notionHeadings } = useContext(NotionHeadingsContext);

  const [activeHeading, setActiveHeading] = useState<
    BlockObjectResponse['id'] | undefined
  >(undefined);

  useEffect(() => {
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

    notionHeadings.forEach((heading) => {
      // element id is set to be exactly the same as the block id
      const headingElement = document.getElementById(heading.id);
      if (headingElement) {
        observer.observe(headingElement);
      }
    });

    return () =>
      notionHeadings.forEach((heading) => {
        const headingElement = document.getElementById(heading.id);
        if (headingElement) {
          observer.unobserve(headingElement);
        }
      });
  }, [notionHeadings]);

  return activeHeading;
}
