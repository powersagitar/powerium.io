import dateFormat from 'dateformat';
import { Fragment } from 'react';

import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { ResetNotionHeadings } from '@/components/contexts/notion-headings';
import { NotionRichTextItems } from '@/components/notion/engine';
import { SearchOnHomePage } from '@/components/search';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { Separator } from '@/components/ui/separator';
import { H1, H2, P } from '@/components/ui/typography';
import { siteConfig } from '@/config/site';
import { getBlogHref } from '@/lib/notion/client';
import { retrievePublishedArticles } from '@/lib/notion/server';
import { NotionBlogPageProperties } from '@/lib/notion/types';

export const revalidate = 14400;

export default function Home() {
  return (
    <>
      <ResetNotionHeadings />

      <H1>{siteConfig.metadata.title}</H1>
      <P>{siteConfig.metadata.description}</P>

      <div className="mt-4 mb-2 grid gap-2 sm:grid-cols-[1fr_1fr_2fr] sm:gap-4">
        <Button variant="outline" asChild>
          <Link href="/about" className="no-underline">
            About
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/contact" className="no-underline">
            Contact
          </Link>
        </Button>

        <SearchOnHomePage />
      </div>

      <PublishedBlog />
    </>
  );
}

async function PublishedBlog() {
  const publishedArticles = (await retrievePublishedArticles(undefined, 5))
    .results as DatabaseObjectResponse[];

  return (
    <>
      <H2>Blog</H2>

      <div className="my-4 grid gap-4 md:grid-cols-[8em_4fr_6fr]">
        {publishedArticles.map((article) => {
          const properties =
            article.properties as unknown as NotionBlogPageProperties;

          const publishDate = new Date(properties.published.date.start);

          return (
            <Fragment key={article.id}>
              <Link href={getBlogHref(article.id)} className="contents">
                <span className="text-muted-foreground">
                  {dateFormat(publishDate, 'mediumDate')}
                </span>

                <span className="underline" tabIndex={0}>
                  {properties.title.title.length > 0 ? (
                    <NotionRichTextItems
                      baseKey={article.id}
                      richText={properties.title.title}
                    />
                  ) : (
                    <>&lt;untitled&gt;</>
                  )}
                </span>

                <span className="text-muted-foreground">
                  {properties.description.rich_text.length > 0 ? (
                    <NotionRichTextItems
                      baseKey={article.id}
                      richText={properties.description.rich_text}
                    />
                  ) : (
                    <>&lt;no description&gt;</>
                  )}
                </span>
              </Link>

              <Separator className="md:hidden" />
            </Fragment>
          );
        })}
      </div>

      <Button asChild>
        <Link href="/blog" className="mt-2 no-underline">
          Load More
        </Link>
      </Button>
    </>
  );
}
