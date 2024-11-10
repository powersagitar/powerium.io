import clsx from 'clsx';
import { useContext } from 'react';

import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionRichTextItems } from '../notion-engine/NotionRichText';
import { NotionHeadingsContext } from '../notion-headings-context';
import { Link } from '../ui/link';
import { Ul } from '../ui/typography';

export default function TOCEntries({
  activeHeading,
}: {
  activeHeading?: BlockObjectResponse['id'];
}) {
  const { notionHeadings } = useContext(NotionHeadingsContext);

  return (
    <Ul className="list-none my-0">
      {notionHeadings.map((heading) => (
        <li
          key={'toc-desktop-' + heading.id}
          className={clsx({
            'text-muted-foreground':
              activeHeading !== undefined && activeHeading !== heading.id,
            'ml-4': heading.type === 'heading_2',
            'ml-8': heading.type === 'heading_3',
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
  );
}
