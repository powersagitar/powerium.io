import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionPageNormal } from '@/components/notion/page';
import { notionConfig } from '@/config/notion';
import { siteConfig } from '@/config/site';
import { retrieveNotionPage } from '@/lib/notion/queries';

const { contact } = notionConfig.auxiliaryPages;

export const metadata: Metadata = {
  title: 'Contact',
  description: contact?.description,
  alternates: {
    canonical: siteConfig.url.origin + '/contact',
  },
};

export default async function Contact() {
  if (!contact) {
    notFound();
  }

  const page = (await retrieveNotionPage(contact.id)) as PageObjectResponse;

  return <NotionPageNormal page={page} />;
}
