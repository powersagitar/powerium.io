import 'server-only';

import { MetadataRoute } from 'next';

import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { siteConfig } from '@/config/site';
import { getBlogHref } from '@/lib/notion/client';
import { retrieveAllPublishedArticles } from '@/lib/notion/server';

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

  return [...auxiliaryPages, ...articlePages];
}
