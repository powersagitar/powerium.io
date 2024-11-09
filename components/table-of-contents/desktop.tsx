import { useEffect, useState } from 'react';

import {
  BlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { cn } from '@/lib/utils';

import { NotionRichTextItems } from '../notion-engine/NotionRichText';
import { Link } from '../ui/link';
import { Ul } from '../ui/typography';

export default function Desktop({
  children: notionPageHeadings,
}: {
  children: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
}) {
  const activeHeading = useActiveHeading(notionPageHeadings);
  const [isTocOpen, setIsTocOpen] = useState(false);

  return (
    <aside className="flex fixed right-0 top-0 bottom-0 items-center z-50">
      {isTocOpen ? (
        <TableOfContents
          notionHeadings={notionPageHeadings}
          activeHeading={activeHeading}
          onMouseLeave={() => setIsTocOpen(false)}
        />
      ) : (
        <Hint
          notionHeadings={notionPageHeadings}
          activeHeading={activeHeading}
          onMouseEnter={() => setIsTocOpen(true)}
        />
      )}
    </aside>
  );
}

function Hint({
  notionHeadings,
  activeHeading,
  onMouseEnter,
}: {
  notionHeadings: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
  activeHeading: BlockObjectResponse['id'];
  onMouseEnter: () => void;
}) {
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
              'bg-foreground': heading.id === activeHeading,
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

function TableOfContents({
  notionHeadings,
  activeHeading,
  onMouseLeave,
}: {
  notionHeadings: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
  activeHeading: BlockObjectResponse['id'];
  onMouseLeave: () => void;
}) {
  return (
    <nav
      className="flex flex-col backdrop-blur py-2 pl-2 pr-3 rounded max-w-prose max-h-[75vh] overflow-y-scroll"
      onMouseLeave={onMouseLeave}
    >
      <Ul className="my-0">
        {notionHeadings.map((heading) => (
          <li
            key={'toc-desktop-' + heading.id}
            className={cn('mb-1.5 first:mt-0 last:mb-0', {
              'text-muted-foreground': activeHeading !== heading.id,
              'ml-3': heading.type === 'heading_2',
              'ml-6': heading.type === 'heading_3',
            })}
          >
            <Link href={'#' + heading.id} className="no-underline">
              <NotionRichTextItems baseKey={heading.id}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(heading as any)[heading.type].rich_text}
              </NotionRichTextItems>
            </Link>
          </li>
        ))}
      </Ul>
    </nav>
  );
}

function useActiveHeading(
  notionHeadings: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[],
) {
  console.assert(notionHeadings.length > 0);

  const [activeHeading, setActiveHeading] = useState<BlockObjectResponse['id']>(
    notionHeadings[0].id,
  );

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
