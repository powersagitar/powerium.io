'use client';

import { useContext, useEffect, useState } from 'react';

import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import LazyLoader from '@/components/LazyLoader';
import { NotionHeadingsContext } from '@/components/contexts/notion-headings';
import NotionBlockChildren from '@/components/notion-engine/NotionBlockChildren';
import TOCDesktop from '@/components/table-of-contents/desktop';
import { retrieveNotionBlockChildren } from '@/lib/notion/client';

type NotionPageLazyProps = {
  pageId: string;
  initial: {
    pageChildren: BlockObjectResponse[];
    startCursor: string | null;
  };
};

export default function NotionPageLazy({
  pageId,
  initial,
}: NotionPageLazyProps) {
  const [pageChildren, setPageChildren] = useState(initial.pageChildren);

  const [startCursor, setStartCursor] = useState(initial.startCursor);

  const [lazyLoaderId, setLazyLoaderId] = useState(0);

  const { setNotionHeadings } = useContext(NotionHeadingsContext);

  useEffect(
    () =>
      setNotionHeadings(
        pageChildren.filter(
          (childBlock) =>
            childBlock.type === 'heading_1' ||
            childBlock.type === 'heading_2' ||
            childBlock.type === 'heading_3',
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
      <TOCDesktop />

      <NotionBlockChildren>
        {{
          fetching: 'manual',
          blockChildren: pageChildren,
        }}
      </NotionBlockChildren>
    </LazyLoader>
  );
}
