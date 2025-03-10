import dateFormat from 'dateformat';
import { Fragment } from 'react';

import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Link } from '@/components/ui/link';
import { Separator } from '@/components/ui/separator';
import { getBlogHref } from '@/lib/notion/client';
import { NotionBlogPageProperties } from '@/lib/notion/types';

import { NotionRichTextItems } from '../engine';

type NotionPublishedBlogProps = {
  publishedArticles: DatabaseObjectResponse[];
};

export default function NotionPublishedBlog({
  publishedArticles,
}: NotionPublishedBlogProps) {
  return (
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
  );
}
