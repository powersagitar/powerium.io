import 'server-only';

import { MetadataRoute } from 'next';

import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { generateNotionPageHref } from '@/lib/notion/client';
import {
  retrieveAllPublishedArticles,
  retrieveNotionPage,
} from '@/lib/notion/server';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedArticles =
    (await retrieveAllPublishedArticles()) as DatabaseObjectResponse[];

  const authority = `${siteConfig.url.protocol}://${siteConfig.url.hostname}`;

  const auxiliaryPages: MetadataRoute.Sitemap = [
    {
      url: authority + '/',
      // publishedArticles is sorted descendingly by last_edited_time, so the first article is most recent
      lastModified: publishedArticles[0].last_edited_time,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = publishedArticles.map(
    (article) => {
      return {
        url: authority + generateNotionPageHref(article),
        lastModified: article.last_edited_time,
        changeFrequency: 'monthly',
        priority: 0.5,
      };
    },
  );

  // pages specified in site.config.ts
  const customPages = (await (() => {
    if (!siteConfig.customPages) {
      return [];
    }

    return Promise.all(
      Array.from(siteConfig.customPages).map(
        async ([path, { notionPageId }]) => {
          const notionPage = (await retrieveNotionPage(
            notionPageId,
          )) as PageObjectResponse;

          return {
            url: authority + path,
            lastModified: notionPage.last_edited_time,
            changeFrequency: 'monthly',
            priority: 0.5,
          };
        },
      ),
    );
  })()) as MetadataRoute.Sitemap;

  return [...auxiliaryPages, ...articlePages, ...customPages];
}
