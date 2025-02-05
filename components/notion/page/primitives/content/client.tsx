'use client';

import { useContext, useEffect, useState } from 'react';

import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionHeadingsContext } from '@/components/contexts/notion-headings';
import { NotionBlockChildren } from '@/components/notion/engine';
import LazyLoader from '@/components/utils/lazy-loader';
import { retrieveNotionBlockChildren } from '@/lib/notion/client';

type NotionPageClientProps = {
  pageId: string;
  initial: {
    pageChildren: BlockObjectResponse[];
    startCursor: string | null;
  };
};

export default function NotionPageContentClient({
  pageId,
  initial,
}: NotionPageClientProps) {
  const [pageChildren, setPageChildren] = useState(initial.pageChildren);

  const [startCursor, setStartCursor] = useState(initial.startCursor);

  const [lazyLoaderId, setLazyLoaderId] = useState(0);

  const { setNotionHeadings } = useContext(NotionHeadingsContext);

  useEffect(
    () =>
      setNotionHeadings(
        pageChildren.filter(
          (block) =>
            block.type === 'heading_1' ||
            block.type === 'heading_2' ||
            block.type === 'heading_3',
        ),
      ),
    [pageChildren, setNotionHeadings],
  );

  return (
    <LazyLoader
      load={() => {
        if (!startCursor) {
          return;
        }

        retrieveNotionBlockChildren(pageId, startCursor).then(
          (listBlockChildrenResponse) => {
            setStartCursor(listBlockChildrenResponse.next_cursor);
            setPageChildren([
              ...pageChildren,
              ...(listBlockChildrenResponse.results as BlockObjectResponse[]),
            ]);

            setLazyLoaderId(lazyLoaderId + 1);
          },
        );
      }}
      id={lazyLoaderId}
    >
      <NotionBlockChildren>
        {{
          fetching: 'manual',
          blockChildren: pageChildren,
        }}
      </NotionBlockChildren>
    </LazyLoader>
  );
}
