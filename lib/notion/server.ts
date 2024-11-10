import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { Client } from '@notionhq/client';

import { notionConfig } from '@/config/notion';

const notion = new Client({ auth: notionConfig.notionApiKey });

export const retrievePublishedArticles = cache(
  async (startCursor?: string) => {
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
    });
  },
  ['retrievePublishedArticles', 'notion'],
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
  ['retrieveAllPublishedArticles', 'notion'],
  { revalidate: notionConfig.cacheTtl },
);

export const queryNotionDatabase = cache(
  async (articlePublishDate: Date, articleTitleSegments: string[]) =>
    notion.databases.query({
      database_id: notionConfig.notionDatabaseId,
      filter: {
        and: [
          {
            property: 'published',
            date: {
              is_not_empty: true,
              equals: articlePublishDate.toISOString(),
            },
          },
          ...((): { property: 'title'; rich_text: { contains: string } }[] =>
            articleTitleSegments.map((segment) => {
              return {
                property: 'title',
                rich_text: {
                  contains: segment,
                },
              };
            }))(),
        ],
      },
    }),
  ['queryNotionDatabase', 'notion'],
  { revalidate: notionConfig.cacheTtl },
);

export const retrieveNotionPage = cache(
  async (pageId: string) => notion.pages.retrieve({ page_id: pageId }),
  ['retrieveNotionPage', 'notion'],
  { revalidate: notionConfig.cacheTtl },
);

export const retrieveNotionBlockChildren = cache(
  async (blockId: string, startCursor?: string) =>
    notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
    }),
  ['fetchNotionBlockChildren', 'notion'],
  { revalidate: notionConfig.cacheTtl },
);
