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
import { H1, H2, Link, P } from '@/components/ui/CommonElements';
import { Button } from '@/components/ui/button';
import * as motion from '@/lib/framer-motion';
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
                <li key={idx} className="rounded-2xl p-8 animate-pulse w-full">
                  <div className="rounded-full w-1/2 h-8 bg-neutral-400 dark:bg-neutral-600" />
                  <div className="rounded-full mt-4 w-full h-4 bg-neutral-400 dark:bg-neutral-600" />
                  <div className="rounded-full mt-4 w-3/4 h-4 bg-neutral-400 dark:bg-neutral-600" />
                </li>
              ))}
            </ul>
          }
        >
          <article>
            <H1 className="mb-12 md:mb-20 w-full text-center text-4xl">Blog</H1>

            <ul className="flex flex-wrap justify-between">
              {publishedArticles.map((article) => (
                <motion.li
                  whileTap={{ opacity: 0 }}
                  className="min-w-full md:min-w-[50%] flex-auto"
                  key={article.id}
                >
                  <Link
                    href={generateNotionPageHref(
                      article as DatabaseObjectResponse,
                    )}
                    className={clsx('block flex-auto p-8 rounded-2xl', {
                      'hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all':
                        isBrowser,
                    })}
                  >
                    <H2 className="text-3xl">
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
                      <P className="mt-4">
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
                </motion.li>
              ))}
            </ul>
          </article>
        </InfiniteScroll>
      </div>
    </LazyLoader>
  );
}
