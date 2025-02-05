import 'server-only';

import { MetadataRoute } from 'next';

import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { notionConfig } from '@/config/notion';
import { siteConfig } from '@/config/site';
import { getBlogHref } from '@/lib/notion/client';
import {
  retrieveAllPublishedArticles,
  retrieveNotionPage,
} from '@/lib/notion/server';

export const revalidate = 14400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedArticles =
    (await retrieveAllPublishedArticles()) as DatabaseObjectResponse[];

  const auxiliaryPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url.origin + '/',
      // publishedArticles is sorted descendingly by last_edited_time, so the first article is most recent
      lastModified: publishedArticles[0].last_edited_time,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = publishedArticles.map(
    (article) => {
      return {
        url: siteConfig.url.origin + getBlogHref(article.id),
        lastModified: article.last_edited_time,
        changeFrequency: 'monthly',
        priority: 0.5,
      };
    },
  );

  // pages specified in site.config.ts
  const customPages = (await (() => {
    if (!notionConfig.customPages) {
      return [];
    }

    return Promise.all(
      Array.from(notionConfig.customPages).map(
        async ([path, { notionPageId }]) => {
          const notionPage = (await retrieveNotionPage(
            notionPageId,
          )) as PageObjectResponse;

          return {
            url: siteConfig.url.origin + path,
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
