import { useContext, useEffect, useState } from 'react';

import {
  BlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { cn } from '@/lib/utils';

import { NotionHeadingsContext } from '../contexts/notion-headings';
import TOCEntries from './commons';

export default function TOCDesktop() {
  const { notionHeadings } = useContext(NotionHeadingsContext);

  const activeHeading = useActiveHeading();
  const [isTocOpen, setIsTocOpen] = useState(false);

  if (notionHeadings.length < 1) {
    return null;
  }

  return (
    <aside className="hidden md:flex fixed right-0 top-0 bottom-0 items-center z-50">
      {isTocOpen ? (
        <nav
          className="flex flex-col backdrop-blur pr-6 py-3 rounded max-w-prose max-h-[75vh] overflow-y-scroll"
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
        className="flex flex-col items-end gap-3 py-2 pl-2 pr-3 rounded backdrop-blur"
        onMouseEnter={onMouseEnter}
      >
        {notionHeadings.map((heading) => (
          <div
            key={'toc-desktop-hint-' + heading.id}
            className={cn('rounded-full h-1 bg-muted transition', {
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
