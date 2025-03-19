import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { NotionPageNormal } from '@/components/notion/page';
import { notionConfig } from '@/config/notion';
import { siteConfig } from '@/config/site';
import {
  retrieveAllPublishedArticles,
  retrieveNotionPage,
} from '@/lib/notion/server';
import { NotionPageProperties } from '@/lib/notion/types';

type Params = {
  id: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  const posts =
    (await retrieveAllPublishedArticles()) as DatabaseObjectResponse[];

  const routes = posts.map((post) => ({ id: post.id }));

  if (notionConfig.auxiliaryPages.about) {
    routes.push({ id: notionConfig.auxiliaryPages.about.id });
  }

  if (notionConfig.auxiliaryPages.contact) {
    routes.push({ id: notionConfig.auxiliaryPages.contact.id });
  }

  return routes;
}

type Props = {
  params: Promise<Params>;
};

async function getPage({ params }: Props) {
  // exception is intentinally not caught
  // as it triggers a 500 internal server error
  const id = (await params).id;

  try {
    return (await retrieveNotionPage(id)) as PageObjectResponse;
  } catch (e) {
    console.warn(e);
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
