'use client';

import { ReactNode, useContext, useEffect, useState } from 'react';

import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import LazyLoader from '@/components/LazyLoader';
import NotionBlockChildren from '@/components/notion-engine/NotionBlockChildren';
import { retrieveNotionBlockChildren } from '@/lib/notion/client';

import { NotionHeadingsContext } from './contexts/notion-headings';
import TOCDesktop from './table-of-contents/desktop';

type NotionPageProps = {
  children: {
    pageHeader: Readonly<ReactNode>;
    pageId: string;
  };
};

export default function NotionPage({ children }: NotionPageProps) {
  const [pageChildren, setPageChildren] = useState<BlockObjectResponse[]>([]);

  const [startCursor, setStartCursor] = useState<string | null | undefined>(
    undefined,
  );

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
    <article className="whitespace-pre-wrap px-3 w-full">
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
        <TOCDesktop />

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
