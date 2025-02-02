'use client';

import dateFormat from 'dateformat';
import { Fragment, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  DatabaseObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { getBlogHref, retrievePublishedArticles } from '@/lib/notion/client';
import { NotionArticlePageProperties } from '@/lib/notion/types';

import NotionRichTextItems from '../notion-engine/rich-text';
import { Link } from '../ui/link';
import { VerticalScrollAreaWithShadow } from '../ui/scroll-area-with-shadow';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { H2 } from '../ui/typography';
import LazyLoader from '../utils/lazy-loader';

export default function PublishedBlogs() {
  const [publishedArticles, setPublishedArticles] = useState<
    DatabaseObjectResponse[]
  >([]);

  const [startCursor, setStartCursor] = useState<string | null | undefined>(
    undefined,
  );

  const [lazyLoaderId, setLazyLoaderId] = useState(0);
  return (
    <>
      <H2 className="w-full">Blogs</H2>
      <LazyLoader
        load={() => {
          retrievePublishedArticles(startCursor).then(
            (queryDatabaseResponse: QueryDatabaseResponse) => {
              setPublishedArticles([
                ...publishedArticles,
                ...(queryDatabaseResponse.results as DatabaseObjectResponse[]),
              ]);

              setStartCursor(queryDatabaseResponse.next_cursor);
            },
          );
        }}
        id={lazyLoaderId}
      >
        <InfiniteScroll
          dataLength={publishedArticles.length}
          next={() => {
            setLazyLoaderId((id) => id + 1);
          }}
          hasMore={startCursor !== null}
          loader={
            <div className="relative -top-6 z-20 grid gap-4 md:grid-cols-[8em_4fr_6fr]">
              {Array.from({ length: 20 }).map((_, i) => (
                <Fragment key={`published-blogs-skeleton-${i}`}>
                  <Skeleton className="h-7 w-[8em]" />
                  <Skeleton className="h-7 w-[4fr]" />
                  <Skeleton className="h-7 w-[6fr]" />
                  <Separator className="md:hidden" />
                </Fragment>
              ))}
            </div>
          }
        >
          <VerticalScrollAreaWithShadow className="grid max-h-[65vh] gap-4 md:grid-cols-[8em_4fr_6fr]">
            {publishedArticles.map((article) => {
              const properties =
                article.properties as unknown as NotionArticlePageProperties;

              const publishDate = new Date(properties.published.date.start);

              return (
                <Fragment key={article.id}>
                  <Link href={getBlogHref(article.id)} className="contents">
                    <span className="text-muted-foreground">
                      {dateFormat(publishDate, 'mediumDate')}
                    </span>

                    <span className="underline" tabIndex={0}>
                      {properties.title.title.length > 0 ? (
                        <NotionRichTextItems baseKey={article.id}>
                          {properties.title.title}
                        </NotionRichTextItems>
                      ) : (
                        <>&lt;untitled&gt;</>
                      )}
                    </span>

                    <span className="text-muted-foreground">
                      {properties.description.rich_text.length > 0 ? (
                        <NotionRichTextItems baseKey={article.id}>
                          {properties.description.rich_text}
                        </NotionRichTextItems>
                      ) : (
                        <>&lt;no description&gt;</>
                      )}
                    </span>
                  </Link>

                  <Separator className="md:hidden" />
                </Fragment>
              );
            })}
          </VerticalScrollAreaWithShadow>
        </InfiniteScroll>
      </LazyLoader>
    </>
  );
}
