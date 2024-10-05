import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { Client } from '@notionhq/client';

import { siteConfig } from '@/site.config';

const notion = new Client({ auth: siteConfig.notionApiKey });

export const retrievePublishedArticles = cache(
  async (startCursor?: string) => {
    return await notion.databases.query({
      database_id: siteConfig.notionDatabaseId,
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
  ['retrievePublishedArticles'],
  { revalidate: siteConfig.cacheTtl },
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
  { revalidate: siteConfig.cacheTtl },
);

export const queryNotionDatabase = cache(
  async (articlePublishDate: Date, articleTitleSegments: string[]) =>
    notion.databases.query({
      database_id: siteConfig.notionDatabaseId,
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
  ['queryNotionDatabase'],
  { revalidate: siteConfig.cacheTtl },
);

export const retrieveNotionPage = cache(
  async (pageId: string) => notion.pages.retrieve({ page_id: pageId }),
  ['retrieveNotionPage'],
  { revalidate: siteConfig.cacheTtl },
);

export const retrieveNotionBlockChildren = cache(
  async (blockId: string, startCursor?: string) =>
    notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
    }),
  ['fetchNotionBlockChildren'],
  { revalidate: siteConfig.cacheTtl },
);
