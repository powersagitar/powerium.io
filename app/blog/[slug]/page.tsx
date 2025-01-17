import 'server-only';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import NotionPage from '@/components/NotionPage';
import NotionRichTextItems from '@/components/notion-engine/rich-text';
import { Link } from '@/components/ui/link';
import { Separator } from '@/components/ui/separator';
import { H1, P } from '@/components/ui/typography';
import { siteConfig } from '@/config/site';
import { retrieveNotionPage } from '@/lib/notion/server';
import { NotionArticlePageProperties } from '@/lib/notion/types';

type GenerateMetadataProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  try {
    const pageId = (await params).slug;
    const page = (await retrieveNotionPage(pageId)) as PageObjectResponse;
    const properties =
      page.properties as unknown as NotionArticlePageProperties;

    return {
      title: properties.title.title
        .map((richtext) => richtext.plain_text)
        .join(''),

      description: properties.description.rich_text
        .map((richtext) => richtext.plain_text)
        .join(''),
    };
  } catch (e) {
    console.warn(e);
    return {};
  }
}

type BlogArticleProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogArticle({ params }: BlogArticleProps) {
  try {
    const pageId = (await params).slug;
    const page = await retrieveNotionPage(pageId);
    return renderPage(page as PageObjectResponse);
  } catch (e) {
    console.warn(e);
    return notFound();
  }
}

function renderPage(page: PageObjectResponse) {
  const properties = page.properties as unknown as NotionArticlePageProperties;

  return (
    <NotionPage>
      {{
        pageHeader: (
          <div className="text-center [overflow-wrap:anywhere]">
            <H1 className="mb-4">
              <NotionRichTextItems baseKey={page.id}>
                {properties.title.title}
              </NotionRichTextItems>
            </H1>

            <address className="not-italic">
              {(() => {
                const articlePublishDate = new Date(
                  properties.published.date.start,
                );

                // const lastEditedTime = new Date(page.last_edited_time);

                return (
                  <time dateTime={articlePublishDate.toISOString()}>
                    <P>
                      <strong className="whitespace-nowrap">
                        {articlePublishDate.toDateString()}
                      </strong>
                    </P>
                  </time>
                );

                // return (
                //   <time dateTime={lastEditedTime.toISOString()}>
                //     {articlePublishDate.toDateString() ===
                //     lastEditedTime.toDateString() ? (
                //       <P>
                //         <strong className="whitespace-nowrap">
                //           {articlePublishDate.toDateString()}
                //         </strong>
                //       </P>
                //     ) : (
                //       <P>
                //         <span className="whitespace-nowrap">
                //           Published{' '}
                //           <strong>{articlePublishDate.toDateString()}</strong>
                //         </span>{' '}
                //         &bull;{' '}
                //         <span className="whitespace-nowrap">
                //           Updated{' '}
                //           <strong>{lastEditedTime.toDateString()}</strong>
                //         </span>
                //       </P>
                //     )}
                //   </time>
                // );
              })()}

              <P className="[&:not(:first-child)]:mt-0">
                {(() => {
                  const authors = (
                    page.properties as unknown as NotionArticlePageProperties
                  ).authors.rich_text;

                  return (
                    <>
                      {authors.length > 0 ? (
                        <NotionRichTextItems baseKey={page.id}>
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
        pageId: page.id,
      }}
    </NotionPage>
  );
}
