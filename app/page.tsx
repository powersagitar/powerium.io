'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { isBrowser, isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  DatabaseObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

import LazyLoader from '@/components/LazyLoader';
import { NotionRichTextItems } from '@/components/notion-engine/NotionRichText';
import { H1, H2, Li, Link, P, Ul } from '@/components/ui/CommonElements';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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
            <H1 styles={{ 'text-align': 'center' }}>Blog</H1>

            <Ul styles={{ 'list-style-type': 'list-none', ml: 'ml-0' }}>
              {publishedArticles.map((article) => (
                <Li key={article.id}>
                  <Link
                    href={generateNotionPageHref(
                      article as DatabaseObjectResponse,
                    )}
                    className={clsx('block flex-auto p-8 rounded-2xl', {
                      'hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all':
                        isBrowser,
                    })}
                  >
                    <H2>
                      <NotionRichTextItems blockId={article.id}>
                        {
                          (
                            (article as DatabaseObjectResponse)
                              .properties as unknown as NotionArticlePageProperties
                          ).title.title
                        }
                      </NotionRichTextItems>
                    </H2>

                    {(
                      (article as DatabaseObjectResponse)
                        .properties as unknown as NotionArticlePageProperties
                    ).description.rich_text.length > 0 && (
                      <P>
                        <NotionRichTextItems blockId={article.id}>
                          {
                            (
                              (article as DatabaseObjectResponse)
                                .properties as unknown as NotionArticlePageProperties
                            ).description.rich_text
                          }
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
              ))}
            </Ul>
          </article>
        </InfiniteScroll>
      </div>
    </LazyLoader>
  );
}
