'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { isDesktop, isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  DatabaseObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

import LazyLoader from '@/components/LazyLoader';
import { NotionRichTextItems } from '@/components/notion-engine/NotionRichText';
import { Li } from '@/components/ui/CommonElements';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { H1, H2, Muted, P, Ul } from '@/components/ui/typography';
import {
  generateNotionPageHref,
  retrievePublishedArticles,
} from '@/lib/notion/client';
import { NotionArticlePageProperties } from '@/lib/notion/types';

export default function Home() {
  const [publishedArticles, setPublishedArticles] = useState<
    DatabaseObjectResponse[]
  >([]);

  const [startCursor, setStartCursor] = useState<string | null | undefined>(
    undefined,
  );

  const [lazyLoaderId, setLazyLoaderId] = useState(0);

  return (
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
      <div className="w-full">
        <InfiniteScroll
          dataLength={publishedArticles.length}
          next={() => {
            setLazyLoaderId((id) => id + 1);
          }}
          hasMore={startCursor !== null}
          loader={
            <ul>
              {Array.from({ length: 10 }).map((_, idx) => (
                <Li styles={{ p: 'p-8' }} key={idx}>
                  <Skeleton className="w-1/2 h-9" />
                  <Separator className="mt-2" />
                  <Skeleton className="mt-8 w-full h-7" />
                  <Skeleton className="mt-4 w-3/4 h-7" />
                </Li>
              ))}
            </ul>
          }
        >
          <article>
            <H1 className="text-center">Blog</H1>

            <Ul className="list-none ml-0">
              {publishedArticles.map((article) => {
                const properties =
                  article.properties as unknown as NotionArticlePageProperties;

                const lastEditedDate = new Date(article.last_edited_time);

                const publishDate = new Date(properties.published.date.start);

                return (
                  <Li key={article.id}>
                    <Link
                      href={generateNotionPageHref(article)}
                      className={clsx(
                        'block flex-auto p-8 rounded-2xl no-underline hover:text-current dark:hover:text-current',
                        {
                          'hover:bg-muted transition-all': isDesktop,
                        },
                      )}
                    >
                      <H2>
                        <NotionRichTextItems blockId={article.id}>
                          {properties.title.title}
                        </NotionRichTextItems>
                      </H2>

                      <time dateTime={lastEditedDate.toISOString()}>
                        {publishDate.toDateString() ===
                        lastEditedDate.toDateString() ? (
                          <Muted>
                            <strong className="whitespace-nowrap">
                              {publishDate.toDateString()}
                            </strong>
                          </Muted>
                        ) : (
                          <Muted>
                            <span className="whitespace-nowrap">
                              Published{' '}
                              <strong>{publishDate.toDateString()}</strong>
                            </span>{' '}
                            &bull;{' '}
                            <span className="whitespace-nowrap">
                              Updated{' '}
                              <strong>{lastEditedDate.toDateString()}</strong>
                            </span>
                          </Muted>
                        )}
                      </time>

                      {properties.description.rich_text.length > 0 && (
                        <P>
                          <NotionRichTextItems blockId={article.id}>
                            {properties.description.rich_text}
                          </NotionRichTextItems>
                        </P>
                      )}

                      {isMobile && (
                        <Button className="mt-8 px-4 py-0.5 w-full">
                          Continue reading...
                        </Button>
                      )}
                    </Link>
                  </Li>
                );
              })}
            </Ul>
          </article>
        </InfiniteScroll>
      </div>
    </LazyLoader>
  );
}
