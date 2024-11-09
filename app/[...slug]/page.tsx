import 'server-only';

import { Metadata } from 'next';
import { unstable_cache as cache } from 'next/cache';
import { notFound } from 'next/navigation';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import NotionPage from '@/components/NotionPage';
import { NotionRichTextItems } from '@/components/notion-engine/NotionRichText';
import { Link } from '@/components/ui/link';
import { Separator } from '@/components/ui/separator';
import { H1, P } from '@/components/ui/typography';
import { notionConfig } from '@/config/notion';
import { siteConfig } from '@/config/site';
import { Pathname } from '@/lib/config/notion';
import { retrieveNotionPage as _retrieveNotionPage } from '@/lib/notion/server';
import { NotionCommonPageProperties } from '@/lib/notion/types';

const retrieveNotionPage = cache(
  async (
    slug: string[],
  ): Promise<{ notionPage: PageObjectResponse; canonical?: Pathname }> => {
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
        notionPage: (await _retrieveNotionPage(pageId)) as PageObjectResponse,
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
  const { notionPage, canonical } = await retrieveNotionPage(params.slug);

  const notionPageProperties =
    notionPage.properties as unknown as NotionCommonPageProperties;

  return {
    title: notionPageProperties.title.title
      .map((richText) => richText.plain_text)
      .join(''),

    description: notionConfig.customPages?.get(canonical!)?.description,
    metadataBase: new URL(
      `${siteConfig.url.protocol}://${siteConfig.url.hostname}`,
    ),
    alternates: {
      canonical,
    },
  };
}

export default async function Article(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const { notionPage } = await retrieveNotionPage(params.slug);

  return (
    <NotionPage>
      {{
        pageHeader: (
          <div className="text-center">
            <H1 className="mb-4">
              <NotionRichTextItems baseKey={notionPage.id}>
                {
                  (
                    notionPage.properties as unknown as NotionCommonPageProperties
                  ).title.title
                }
              </NotionRichTextItems>
            </H1>

            <address className="not-italic">
              {(() => {
                const lastEditedTime = new Date(notionPage.last_edited_time);

                return (
                  <time dateTime={lastEditedTime.toISOString()}>
                    <P>
                      <span className="whitespace-nowrap">
                        Updated <strong>{lastEditedTime.toDateString()}</strong>
                      </span>
                    </P>
                  </time>
                );
              })()}

              <P className="[&:not(:first-child)]:mt-0">
                <Link href={siteConfig.metadata.author.url ?? '/'}>
                  <strong>{siteConfig.metadata.author.name}</strong>
                </Link>
              </P>
            </address>

            <Separator className="my-6" />
          </div>
        ),
        pageId: notionPage.id,
      }}
    </NotionPage>
  );
}
