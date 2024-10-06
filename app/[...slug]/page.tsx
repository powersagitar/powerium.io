import 'server-only';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { siteConfig } from '@/site.config';

import { retrieveNotionPage } from '../lib/notion/server';
import { NotionCommonPageProperties } from '../lib/notion/types';
import { UrlPath } from '../lib/site.config';
import { H1, Hr, Link, P } from '../ui/components/CommonElements';
import NotionPage from '../ui/components/NotionPage';
import { NotionRichTextItems } from '../ui/components/notion-engine/NotionRichText';

function validateSlug(
  slug: string[],
): { isValid: false } | { isValid: true; pathname: UrlPath } {
  const pathname: UrlPath = `/${slug.join('/')}`;

  if (!siteConfig.customPages?.has(pathname)) {
    return { isValid: false };
  }

  return { isValid: true, pathname };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const slugValidation = validateSlug(params.slug);

  if (!slugValidation.isValid) {
    return notFound();
  }

  const { pathname } = slugValidation;

  const notionPageProperties = (
    (await retrieveNotionPage(
      siteConfig.customPages!.get(pathname)!.notionPageId,
    )) as PageObjectResponse
  ).properties as unknown as NotionCommonPageProperties;

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
  const slugValidation = validateSlug(params.slug);

  if (!slugValidation.isValid) {
    return notFound();
  }

  const { pathname } = slugValidation;

  const notionPage = (await retrieveNotionPage(
    siteConfig.customPages!.get(pathname)!.notionPageId,
  )) as PageObjectResponse;

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
