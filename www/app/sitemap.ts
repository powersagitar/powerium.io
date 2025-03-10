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
    {
      url: siteConfig.url.origin + '/blog',
      lastModified: publishedArticles[0].last_edited_time,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  if (notionConfig.auxiliaryPages.about) {
    try {
      const page = (await retrieveNotionPage(
        notionConfig.auxiliaryPages.about.id,
      )) as PageObjectResponse;

      auxiliaryPages.push({
        url: siteConfig.url.origin + '/about',
        lastModified: page.last_edited_time,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    } catch (e) {
      console.error(e);
    }
  }

  if (notionConfig.auxiliaryPages.contact) {
    try {
      const page = (await retrieveNotionPage(
        notionConfig.auxiliaryPages.contact.id,
      )) as PageObjectResponse;

      auxiliaryPages.push({
        url: siteConfig.url.origin + '/contact',
        lastModified: page.last_edited_time,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    } catch (e) {
      console.log(e);
    }
  }

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
