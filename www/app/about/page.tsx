import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionPageNormal } from '@/components/notion/page';
import { notionConfig } from '@/config/notion';
import { siteConfig } from '@/config/site';
import { retrieveNotionPage } from '@/lib/notion/server';

const { about } = notionConfig.auxiliaryPages;

export const revalidate = 14400;

export const metadata: Metadata = {
  title: 'About',
  description: about?.description,
  alternates: {
    canonical: siteConfig.url.origin + '/about',
  },
};

export default async function About() {
  if (!about) {
    notFound();
  }

  const page = (await retrieveNotionPage(about.id)) as PageObjectResponse;

  return <NotionPageNormal page={page} />;
}
