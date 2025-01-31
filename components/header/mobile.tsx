'use client';

import {
  ComponentPropsWithoutRef,
  ComponentRef,
  SetStateAction,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  DatabaseObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { TabsContent } from '@radix-ui/react-tabs';

import { siteConfig } from '@/config/site';
import fetchCustomPages from '@/lib/fetch-custom-pages';
import { getBlogHref, retrievePublishedArticles } from '@/lib/notion/client';
import { NotionArticlePageProperties } from '@/lib/notion/types';

import { NotionHeadingsContext } from '../contexts/notion-headings';
import NotionRichTextItems from '../notion-engine/rich-text';
import TOCEntries from '../table-of-contents/commons';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { Link } from '../ui/link';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Large, Ul } from '../ui/typography';

export default function Mobile() {
  const [open, setOpen] = useState(false);
  const [customPages, setCustomPages] = useState([]);
  const [blogArticles, setBlogArticles] = useState<DatabaseObjectResponse[]>(
    [],
  );
  const { notionHeadings } = useContext(NotionHeadingsContext);

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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="mx-1 flex px-3 md:hidden"
          aria-label="Open left sidebar (mobile only)"
        >
          <HamburgerMenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Tabs
          defaultValue={notionHeadings.length < 1 ? 'nav' : 'toc'}
          className="mt-2 max-h-[75vh] overflow-y-auto"
        >
          <TabsList className="sticky top-0 z-50 mx-auto grid w-11/12 grid-cols-2">
            <TabsTrigger value="nav">Navigation</TabsTrigger>
            <TabsTrigger value="toc" disabled={notionHeadings.length < 1}>
              Table of Contents
            </TabsTrigger>
          </TabsList>
          <TabsContent value="nav">
            <DrawerHeader className="ml-6 px-0">
              <DrawerTitle>
                <MobileLink
                  href="/"
                  className="text-left no-underline"
                  onOpenChange={setOpen}
                >
                  <Large>{siteConfig.metadata.title}</Large>
                </MobileLink>
              </DrawerTitle>
            </DrawerHeader>
            <Ul className="my-0 mb-6 list-none">
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
                <Large className="ml-6 text-base">Recent Posts</Large>
                <Ul className="list-none">
                  {blogArticles.map((article) => {
                    const properties =
                      article.properties as unknown as NotionArticlePageProperties;

                    return (
                      <li key={'sidebar-nav-' + article.id}>
                        <MobileLink
                          href={getBlogHref(article.id)}
                          className="text-muted-foreground no-underline"
                          onOpenChange={setOpen}
                        >
                          <NotionRichTextItems baseKey={article.id}>
                            {properties.title.title}
                          </NotionRichTextItems>
                        </MobileLink>
                      </li>
                    );
                  })}
                </Ul>
              </>
            )}
          </TabsContent>
          <TabsContent value="toc">
            <DrawerHeader className="ml-6 px-0">
              <DrawerTitle className="text-left">Table of Contents</DrawerTitle>
            </DrawerHeader>
            <div onClick={() => setOpen(false)}>
              <TOCEntries />
            </div>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
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
