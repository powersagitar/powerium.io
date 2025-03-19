import clsx from 'clsx';

import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionHeading } from '@/lib/notion/page';

import NotionRichTextItems from '../notion/engine/rich-text';
import { Link } from '../ui/link';
import { Ul } from '../ui/typography';

type TOCEntriesProps = {
  activeHeading?: BlockObjectResponse['id'];
  headings: NotionHeading[];
};

export default function TOCEntries({
  activeHeading,
  headings,
}: TOCEntriesProps) {
  return (
    <Ul className="my-0 list-none">
      {headings.map((heading) => (
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
