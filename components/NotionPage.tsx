'use client';

import { ReactNode, useState } from 'react';

import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import LazyLoader from '@/components/LazyLoader';
import NotionBlockChildren from '@/components/notion-engine/NotionBlockChildren';
import { retrieveNotionBlockChildren } from '@/lib/notion/client';

import TableOfContents from './table-of-contents/TableOfContents';

export default function NotionPage({
  children,
}: {
  children: {
    pageHeader: ReactNode;
    pageId: string;
  };
}) {
  const [pageChildren, setPageChildren] = useState<BlockObjectResponse[]>([]);

  const [startCursor, setStartCursor] = useState<string | null | undefined>(
    undefined,
  );

  const [lazyLoaderId, setLazyLoaderId] = useState(0);

  return (
    <article className="whitespace-pre-wrap">
      {children.pageHeader}

      <LazyLoader
        load={() => {
          retrieveNotionBlockChildren(children.pageId, startCursor).then(
            (listBlockChildrenResponse) => {
              setStartCursor(listBlockChildrenResponse.next_cursor);
              setPageChildren([
                ...pageChildren,
                ...(listBlockChildrenResponse.results as BlockObjectResponse[]),
              ]);

              if (listBlockChildrenResponse.next_cursor !== null) {
                setLazyLoaderId(lazyLoaderId + 1);
              }
            },
          );
        }}
        id={lazyLoaderId}
      >
        <TableOfContents>
          {pageChildren.filter(
            (childBlock) =>
              childBlock.type === 'heading_1' ||
              childBlock.type === 'heading_2' ||
              childBlock.type === 'heading_3',
          )}
        </TableOfContents>

        <NotionBlockChildren>
          {{
            fetching: 'manual',
            blockChildren: pageChildren,
          }}
        </NotionBlockChildren>
      </LazyLoader>
    </article>
  );
}
