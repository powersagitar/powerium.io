import 'server-only';

import { ReactNode } from 'react';

import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { retrieveNotionBlockChildren } from '@/lib/notion/server';

import NotionPageLazy from './NotionPageLazy';

type NotionPageProps = {
  children: {
    pageHeader: Readonly<ReactNode>;
    pageId: string;
  };
};

export default async function NotionPage({ children }: NotionPageProps) {
  const pageChildrenResponse = await retrieveNotionBlockChildren(
    children.pageId,
  );

  const pageChildren = pageChildrenResponse.results as BlockObjectResponse[];
  const startCursor = pageChildrenResponse.next_cursor;

  return (
    <article className="whitespace-pre-wrap px-3 w-full">
      {children.pageHeader}

      <NotionPageLazy
        pageId={children.pageId}
        initial={{ pageChildren, startCursor }}
      />
    </article>
  );
}
