import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionPageNormal } from '@/components/notion';
import { siteConfig } from '@/config/site';
import {
  retrieveNotionPage as _retrieveNotionPage,
  retrieveNotionPage,
} from '@/lib/notion/server';
import { NotionPageProperties } from '@/lib/notion/types';

type Props = {
  params: Promise<{ id: string }>;
};

async function getPage({ params }: Props) {
  // exception is intentinally not caught
  // as it triggers a 500 internal server error
  const id = (await params).id;

  try {
    return (await retrieveNotionPage(id)) as PageObjectResponse;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  // exception is intentinally not caught
  // as it triggers a 500 internal server error
  const page = await getPage(props);
  const properties = page.properties as NotionPageProperties;
  const title = properties.title.title
    .map((richtext) => richtext.plain_text)
    .join('');

  const canonical = siteConfig.url.origin + '/' + page.id;
  const url = canonical;
  const siteName = siteConfig.metadata.title;
  const ogImageURL = siteConfig.url.origin + '/api/og/' + page.id;

  return {
    title,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      url,
      siteName,
      images: [
        {
          url: ogImageURL,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function NotionPage(props: Props) {
  // exception is intentinally not caught
  // as it triggers a 500 internal server error
  const page = await getPage(props);
  return <NotionPageNormal page={page} />;
}
