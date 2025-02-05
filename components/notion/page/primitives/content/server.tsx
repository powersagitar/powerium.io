import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { retrieveNotionBlockChildren } from '@/lib/notion/server';

import NotionPageContentClient from './client';

type NotionPageContentProps = {
  id: string;
};

export default async function NotionPageContent({
  id,
}: NotionPageContentProps) {
  const pageChildrenResponse = await retrieveNotionBlockChildren(id);

  const pageChildren = pageChildrenResponse.results as BlockObjectResponse[];
  const startCursor = pageChildrenResponse.next_cursor;

  return (
    <NotionPageContentClient
      pageId={id}
      initial={{ pageChildren, startCursor }}
    />
  );
}
