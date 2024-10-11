import 'server-only';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { siteConfig } from '@/site.config';

import { retrieveNotionPage as _retrieveNotionPage } from '../lib/notion/server';
import { NotionCommonPageProperties } from '../lib/notion/types';
import { Pathname } from '../lib/site.config';
import { H1, Hr, Link, P } from '../ui/components/CommonElements';
import NotionPage from '../ui/components/NotionPage';
import { NotionRichTextItems } from '../ui/components/notion-engine/NotionRichText';

async function retrieveNotionPage(
  slug: string[],
): Promise<{ notionPage: PageObjectResponse; pathname: Pathname }> {
  const pathname: Pathname = `/${slug.join('/')}`;

  if (!siteConfig.customPages?.has(pathname)) {
    return notFound();
  }

  return {
    notionPage: (await _retrieveNotionPage(
      siteConfig.customPages!.get(pathname)!.notionPageId,
    )) as PageObjectResponse,
    pathname,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const { notionPage, pathname } = await retrieveNotionPage(params.slug);

  const notionPageProperties =
    notionPage.properties as unknown as NotionCommonPageProperties;

  return {
    title: notionPageProperties.title.title
      .map((richText) => richText.plain_text)
      .join(''),

    description: siteConfig.customPages!.get(pathname)!.description,
  };
}

export default async function Article({
  params,
}: {
  params: { slug: string[] };
}) {
  const { notionPage } = await retrieveNotionPage(params.slug);

  return (
    <NotionPage>
      {{
        pageHeader: (
          <div className="text-center">
            <H1>
              <NotionRichTextItems blockId={notionPage.id}>
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
                    <P className="mb-2">
                      <span className="whitespace-nowrap">
                        Updated <strong>{lastEditedTime.toDateString()}</strong>
                      </span>
                    </P>
                  </time>
                );
              })()}

              <P className="mb-4">
                <Link href={siteConfig.metadata.author.url ?? '/'}>
                  <strong>{siteConfig.metadata.author.name}</strong>
                </Link>
              </P>
            </address>

            <Hr />
          </div>
        ),
        pageId: notionPage.id,
      }}
    </NotionPage>
  );
}
