'use client';

import { useEffect, useState } from 'react';

import {
  DatabaseObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import { siteConfig } from '@/config/site';
import fetchCustomPages from '@/lib/fetch-custom-pages';
import {
  generateNotionPageHref,
  retrievePublishedArticles,
} from '@/lib/notion/client';
import { NotionArticlePageProperties } from '@/lib/notion/types';

import { Button } from '../ui/button';
import { Link } from '../ui/link';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Large, Ul } from '../ui/typography';

export default function Mobile() {
  const [open, setOpen] = useState(false);
  const [customPages, setCustomPages] = useState([]);
  const [blogArticles, setBlogArticles] = useState<DatabaseObjectResponse[]>(
    [],
  );

  useEffect(() => {
    fetchCustomPages().then((customPagesT) => {
      setCustomPages(Object.values(customPagesT));
    });
  }, []);

  useEffect(() => {
    retrievePublishedArticles().then((articles: QueryDatabaseResponse) =>
      setBlogArticles(articles.results as DatabaseObjectResponse[]),
    );
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTitle>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="px-3 mx-1 flex md:hidden"
            aria-label="Open left sidebar (mobile only)"
          >
            <HamburgerMenuIcon />
          </Button>
        </SheetTrigger>
      </SheetTitle>
      <SheetContent side="left" className="pr-0" onClick={() => setOpen(false)}>
        <Link href="/" className="no-underline w-full">
          <Large>{siteConfig.name}</Large>
        </Link>
        <ScrollArea>
          <Ul className="list-none">
            {customPages.map(({ href, title }) => (
              <li key={href}>
                <Link href={href} className="no-underline">
                  {title}
                </Link>
              </li>
            ))}
          </Ul>

          {blogArticles.length > 0 && (
            <>
              <Large className="text-base">Recent Posts</Large>
              <Ul className="list-none">
                {blogArticles.map((article) => {
                  const properties =
                    article.properties as unknown as NotionArticlePageProperties;

                  return (
                    <li key={'sidebar-nav-' + article.id}>
                      <Link
                        href={generateNotionPageHref(article)}
                        className="no-underline text-muted-foreground"
                      >
                        {properties.title.title
                          .map((richText) => richText.plain_text)
                          .join('')}
                      </Link>
                    </li>
                  );
                })}
              </Ul>
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
