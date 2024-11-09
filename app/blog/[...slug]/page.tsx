import 'server-only';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import NotionPage from '@/components/NotionPage';
import { NotionRichTextItems } from '@/components/notion-engine/NotionRichText';
import { Link } from '@/components/ui/link';
import { Separator } from '@/components/ui/separator';
import { H1, P } from '@/components/ui/typography';
import { siteConfig } from '@/config/site';
import { queryNotionDatabase } from '@/lib/notion/server';
import { NotionArticlePageProperties } from '@/lib/notion/types';

function validateSlug(slug: string[]):
  | { isValid: false }
  | {
      isValid: true;
      articlePublishDate: Date;
      articleTitleSegments: string;
    } {
  if (slug.length !== 4) {
    return { isValid: false };
  }

  const articlePublishDate = new Date(`${slug[0]}-${slug[1]}-${slug[2]}`);

  if (isNaN(articlePublishDate.valueOf()) || articlePublishDate > new Date()) {
    return { isValid: false };
  }

  return { isValid: true, articlePublishDate, articleTitleSegments: slug[3] };
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slugValidation = validateSlug(params.slug);

  if (!slugValidation.isValid) {
    return notFound();
  }

  const { articlePublishDate, articleTitleSegments } = slugValidation;

  const notionDatabaseQuery = await queryNotionDatabase(
    articlePublishDate,
    articleTitleSegments.split('-').filter((segment) => segment !== ''),
  );

  if (notionDatabaseQuery.results.length < 1) {
    return notFound();
  }

  // Assuming no two pages have the same publication date and title,
  // if there is, only the first one will be used
  // This behavior is intentional
  const notionPageProperties = (
    notionDatabaseQuery.results[0] as DatabaseObjectResponse
  ).properties as unknown as NotionArticlePageProperties;

  return {
    title: notionPageProperties.title.title
      .map((segment) => segment.plain_text)
      .join(''),

    description: notionPageProperties.description.rich_text
      .map((segment) => segment.plain_text)
      .join(''),
  };
}

export default async function BlogArticle(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const slugValidation = validateSlug(params.slug);

  if (!slugValidation.isValid) {
    return notFound();
  }

  const { articlePublishDate, articleTitleSegments } = slugValidation;

  const notionDatabaseQuery = await queryNotionDatabase(
    articlePublishDate,
    articleTitleSegments.split('-').filter((segment) => segment !== ''),
  );

  if (notionDatabaseQuery.results.length < 1) {
    return notFound();
  }

  // Assuming no two pages have the same publication date and title,
  // if there is, only the first one will be used
  // This behavior is intentional
  const notionPage = notionDatabaseQuery.results[0] as DatabaseObjectResponse;

  return (
    <NotionPage>
      {{
        pageHeader: (
          <div className="text-center">
            <H1 className="mb-4">
              <NotionRichTextItems baseKey={notionPage.id}>
                {
                  (
                    notionPage.properties as unknown as NotionArticlePageProperties
                  ).title.title
                }
              </NotionRichTextItems>
            </H1>

            <address className="not-italic">
              {(() => {
                const lastEditedTime = new Date(notionPage.last_edited_time);

                return (
                  <time dateTime={lastEditedTime.toISOString()}>
                    {articlePublishDate.toDateString() ===
                    lastEditedTime.toDateString() ? (
                      <P>
                        <strong className="whitespace-nowrap">
                          {articlePublishDate.toDateString()}
                        </strong>
                      </P>
                    ) : (
                      <P>
                        <span className="whitespace-nowrap">
                          Published{' '}
                          <strong>{articlePublishDate.toDateString()}</strong>
                        </span>{' '}
                        &bull;{' '}
                        <span className="whitespace-nowrap">
                          Updated{' '}
                          <strong>{lastEditedTime.toDateString()}</strong>
                        </span>
                      </P>
                    )}
                  </time>
                );
              })()}

              <P className="[&:not(:first-child)]:mt-0">
                {(() => {
                  const authors = (
                    notionPage.properties as unknown as NotionArticlePageProperties
                  ).authors.rich_text;

                  return (
                    <>
                      {authors.length > 0 ? (
                        <NotionRichTextItems baseKey={notionPage.id}>
                          {authors}
                        </NotionRichTextItems>
                      ) : (
                        <Link href={siteConfig.metadata.author.url ?? '/'}>
                          <strong>{siteConfig.metadata.author.name}</strong>
                        </Link>
                      )}
                    </>
                  );
                })()}
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
