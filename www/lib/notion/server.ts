import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { Client } from '@notionhq/client';
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notionConfig } from '@/config/notion';

const notion = new Client({ auth: notionConfig.notionApiKey });

export const retrievePublishedArticles = cache(
  async (startCursor?: string, pageSize?: number) => {
    return await notion.databases.query({
      database_id: notionConfig.notionDatabaseId,
      start_cursor: startCursor,
      filter: {
        and: [
          {
            property: 'published',
            date: {
              is_not_empty: true,
              on_or_before: new Date().toISOString(),
            },
          },
        ],
      },
      sorts: [
        {
          property: 'published',
          direction: 'descending' as 'ascending' | 'descending',
        },
      ],
      page_size: pageSize,
    });
  },
  ['retrievePublishedArticles'],
  { revalidate: notionConfig.cacheTtl },
);

export const retrieveAllPublishedArticles = cache(
  async () => {
    const publishedArticlesPaginated = [await retrievePublishedArticles()];

    while (
      publishedArticlesPaginated[publishedArticlesPaginated.length - 1].has_more
    ) {
      publishedArticlesPaginated.push(
        await retrievePublishedArticles(
          publishedArticlesPaginated[publishedArticlesPaginated.length - 1]
            .next_cursor ?? undefined,
        ),
      );
    }

    return publishedArticlesPaginated
      .map((publishedArticles) => publishedArticles.results)
      .flat();
  },
  ['retrieveAllPublishedArticles'],
  { revalidate: notionConfig.cacheTtl },
);

export const retrieveNotionPage = cache(
  async (pageId: string) => notion.pages.retrieve({ page_id: pageId }),
  ['retrieveNotionPage'],
  { revalidate: notionConfig.cacheTtl },
);

export const retrieveNotionBlockChildren = cache(
  async (blockId: string, startCursor?: string) =>
    notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
    }),
  ['fetchNotionBlockChildren'],
  { revalidate: notionConfig.cacheTtl },
);

export const retrieveNotionBlockChildrenAll = cache(
  async (id: string) => {
    const listBlockChildrenResponses = [await retrieveNotionBlockChildren(id)];

    while (
      listBlockChildrenResponses[listBlockChildrenResponses.length - 1].has_more
    ) {
      listBlockChildrenResponses.push(
        await retrieveNotionBlockChildren(
          id,
          listBlockChildrenResponses[listBlockChildrenResponses.length - 1]
            .next_cursor!,
        ),
      );
    }

    return listBlockChildrenResponses
      .map((response) => response.results)
      .flat() as BlockObjectResponse[];
  },
  ['retrieveNotionBlockChildrenAll'],
  { revalidate: notionConfig.cacheTtl },
);
