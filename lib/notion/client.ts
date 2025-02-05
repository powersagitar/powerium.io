import {
  ListBlockChildrenResponse,
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

export function getBlogHref(pageId: PageObjectResponse['id']) {
  return `/blog/${pageId}`;
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

  return fetch(`/api/notion/block-children?${searchParams.toString()}`, {
    next: { revalidate: 14400 },
  }).then((response) => response.json());
}

export async function retrievePublishedArticles(
  startCursor?: string | null,
): Promise<QueryDatabaseResponse> {
  const searchParams = new URLSearchParams();

  if (startCursor) {
    searchParams.set('start-cursor', startCursor);
  }

  return fetch(`/api/notion/published-articles?${searchParams.toString()}`, {
    next: { revalidate: 14400 },
  }).then((response) => response.json());
}
