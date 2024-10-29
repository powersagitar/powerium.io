'use client';

import {
  ComponentPropsWithoutRef,
  ComponentRef,
  SetStateAction,
  forwardRef,
  useEffect,
  useState,
} from 'react';

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

import { NotionRichTextItems } from '../notion-engine/NotionRichText';
import { Button } from '../ui/button';
import { Link } from '../ui/link';
import { ScrollArea } from '../ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
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
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-3 mx-1 flex md:hidden"
          aria-label="Open left sidebar (mobile only)"
        >
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader>
          <SheetTitle>
            <MobileLink
              href="/"
              className="no-underline w-full text-left"
              onOpenChange={setOpen}
            >
              <Large>{siteConfig.name}</Large>
            </MobileLink>
          </SheetTitle>
          <SheetDescription className="sr-only">
            {siteConfig.metadata.description}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea>
          <Ul className="list-none">
            {customPages.map(({ href, title }) => (
              <li key={href}>
                <MobileLink
                  href={href}
                  className="no-underline"
                  onOpenChange={setOpen}
                >
                  {title}
                </MobileLink>
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
                      <MobileLink
                        href={generateNotionPageHref(article)}
                        className="no-underline text-muted-foreground"
                        onOpenChange={setOpen}
                      >
                        <NotionRichTextItems blockId={article.id}>
                          {properties.title.title}
                        </NotionRichTextItems>
                      </MobileLink>
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

const MobileLink = forwardRef<
  ComponentRef<typeof Link>,
  ComponentPropsWithoutRef<typeof Link> & {
    onOpenChange: (value: SetStateAction<boolean>) => void;
  }
>((props, ref) => {
  const { children, onOpenChange, ...otherProps } = props;

  return (
    <Link {...otherProps} ref={ref} onClick={() => onOpenChange(false)}>
      {children}
    </Link>
  );
});

MobileLink.displayName = 'MobileLink';
