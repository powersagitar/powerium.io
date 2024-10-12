'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { isBrowser, isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  DatabaseObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

import * as motion from './lib/framer-motion';
import {
  generateNotionPageHref,
  retrievePublishedArticles,
} from './lib/notion/client';
import { NotionArticlePageProperties } from './lib/notion/types';
import { H1, H2, Hr, Link, P } from './ui/components/CommonElements';
import LazyLoader from './ui/components/LazyLoader';
import { NotionRichTextItems } from './ui/components/notion-engine/NotionRichText';

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
      <InfiniteScroll
        dataLength={publishedArticles.length}
        next={() => {
          setLazyLoaderId((id) => id + 1);
        }}
        hasMore={startCursor !== null}
        loader={<P>Loading...</P>}
      >
        {publishedArticles.length > 0 && (
          <article>
            <H1 className="mb-12 md:mb-20 w-full text-center text-4xl">Blog</H1>

            <ul className="flex flex-wrap justify-between">
              {publishedArticles.map((article, idx, arr) => (
                <>
                  <motion.li
                    whileTap={{ opacity: 0 }}
                    key={article.id}
                    className="min-w-full md:min-w-[50%] flex-auto"
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
                        <button className="mt-8 px-4 py-0.5 rounded-lg w-full text-white bg-black dark:text-black dark:bg-white">
                          Continue reading...
                        </button>
                      )}
                    </Link>
                  </motion.li>

                  {isMobile && idx !== arr.length - 1 && <Hr />}
                </>
              ))}
            </ul>
          </article>
        )}
      </InfiniteScroll>
    </LazyLoader>
  );
}
