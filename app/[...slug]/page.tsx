import 'server-only';

import { Metadata } from 'next';
import { unstable_cache as cache } from 'next/cache';
import { notFound } from 'next/navigation';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import NotionPageNormal from '@/components/notion/normal-page';
import { notionConfig } from '@/config/notion';
import { siteConfig } from '@/config/site';
import { Pathname } from '@/lib/config/notion';
import { retrieveNotionPage as _retrieveNotionPage } from '@/lib/notion/server';
import { NotionPageProperties } from '@/lib/notion/types';

const retrieveNotionPage = cache(
  async (
    slug: string[],
  ): Promise<{ page: PageObjectResponse; canonical?: Pathname }> => {
    const pathname: Pathname = `/${slug.join('/')}`;

    const pageId =
      notionConfig.customPages!.get(pathname)?.notionPageId ?? slug.join('');

    const pageIdToCanonical = new Map<string, Pathname>(
      Array.from(notionConfig.customPages!).map(
        ([pathname, { notionPageId }]) => [notionPageId, pathname],
      ),
    );

    try {
      return {
        page: (await _retrieveNotionPage(pageId)) as PageObjectResponse,
        canonical: pageIdToCanonical.get(pageId),
      };
    } catch (_) {
      return notFound();
    }
  },
  ['app-slug-page-retrieveNotionPage'],
  // revalidation not required since value is hard coded in site.config.ts
  // and will not change during runtime
  { revalidate: false },
);

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { page, canonical } = await retrieveNotionPage(params.slug);

  const pageProperties = page.properties as unknown as NotionPageProperties;

  const title = pageProperties.title.title
    .map((richtext) => richtext.plain_text)
    .join('');

  const description = notionConfig.customPages?.get(canonical!)?.description;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      title,
      description,
      url: `${siteConfig.url.origin}/${page.id}`,
      siteName: siteConfig.metadata.title,
      images: [
        {
          url: `${siteConfig.url.origin}/api/og/${page.id}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function NotionPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const { page } = await retrieveNotionPage(params.slug);

  return <NotionPageNormal page={page} />;
}
