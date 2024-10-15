import {
  DatabaseObjectResponse,
  ListBlockChildrenResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { NotionArticlePageProperties } from './types';

export function generateNotionPageHref(
  notionPage: DatabaseObjectResponse,
): string {
  const properties =
    notionPage.properties as unknown as NotionArticlePageProperties;

  const published = new Date(properties.published.date.start);

  // Date.getUTCMonth() returns 0-based months, where 0 is January
  const dateSegment = `${published.getUTCFullYear()}/${(published.getUTCMonth() + 1).toString().padStart(2, '0')}/${published.getUTCDate().toString().padStart(2, '0')}`;

  const titleSegment = properties.title.title
    .map((richText) => richText.plain_text)
    .join('')
    .replace(/[\W_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return `/blog/${dateSegment}/${titleSegment}`;
}

export async function retrieveNotionBlockChildren(
  blockId: string,
  startCursor?: string | null,
): Promise<ListBlockChildrenResponse> {
  const searchParams = new URLSearchParams({
    'block-id': blockId,
  });

  if (startCursor) {
    searchParams.set('start-cursor', startCursor);
  }

  return fetch(`/api/notion/block-children?${searchParams.toString()}`).then(
    (response) => response.json(),
  );
}

export async function retrievePublishedArticles(
  startCursor?: string | null,
): Promise<QueryDatabaseResponse> {
  const searchParams = new URLSearchParams();

  if (startCursor) {
    searchParams.set('start-cursor', startCursor);
  }

  return fetch(
    `/api/notion/published-articles?${searchParams.toString()}`,
  ).then((response) => response.json());
}
