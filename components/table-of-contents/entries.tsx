import clsx from 'clsx';
import { useContext } from 'react';

import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionHeadingsContext } from '../contexts/notion-headings';
import NotionRichTextItems from '../notion/engine/rich-text';
import { Link } from '../ui/link';
import { Ul } from '../ui/typography';

type TOCEntriesProps = {
  activeHeading?: BlockObjectResponse['id'];
};

export default function TOCEntries({ activeHeading }: TOCEntriesProps) {
  const { notionHeadings } = useContext(NotionHeadingsContext);

  return (
    <Ul className="my-0 list-none">
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
            <NotionRichTextItems
              baseKey={heading.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              richText={(heading as any)[heading.type].rich_text}
            />
          </Link>
        </li>
      ))}
    </Ul>
  );
}
