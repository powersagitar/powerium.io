'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ExternalLink, Menu } from 'lucide-react';
import siteConfig from '~/site.config';

import { useLastEdited } from '@/components/LastEditedContext';
import { TableOfContents } from '@/components/mdx/TableOfContents';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { NavSection } from '@/lib/nav';

export function Sidebar({ nav }: { nav: NavSection[] }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
  const { lastEdited } = useLastEdited();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  }

  function navList(onLinkClick?: () => void) {
    return (
      <>
        <div className="mb-8 px-2.5">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={onLinkClick}
          >
            <span className="bg-foreground text-background inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-[11px] font-bold tracking-[-0.04em]">
              {siteConfig.name[0]}
            </span>
            <span className="text-sm font-semibold tracking-[-0.015em]">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        {nav.map((section) => (
          <div key={section.label} className="mb-5">
            <div className="text-muted-foreground mb-1.5 px-2.5 text-[11px] font-semibold tracking-wider uppercase">
              {section.label}
            </div>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onLinkClick}
                      className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                        active
                          ? 'bg-accent text-foreground font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      {section.isDirective && (
                        <span className="text-muted-foreground font-mono text-xs">
                          ::
                        </span>
                      )}
                      <span
                        className={
                          section.isDirective
                            ? 'font-mono text-[12.5px]'
                            : undefined
                        }
                      >
                        {item.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {(siteConfig.repository || siteConfig.author || lastEdited) && (
          <>
            <div className="border-border mx-2.5 my-3 border-t" />
            <div className="text-muted-foreground flex flex-col gap-1 px-2.5 text-xs">
              {lastEdited && (
                <p className="py-1.5">
                  Last edited <time dateTime={lastEdited}>{lastEdited}</time>
                </p>
              )}
              {siteConfig.repository && (
                <a
                  href={`${siteConfig.repository}/blob/${siteConfig.branch ?? 'main'}/content${pathname === '/' ? '/index' : pathname}.mdx`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground flex items-center gap-2 py-1.5 transition-colors"
                >
                  <span>Edit on GitHub</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {siteConfig.author && (
                <p className="py-1.5">
                  Copyright &copy; {new Date().getFullYear()}{' '}
                  {siteConfig.author}. Share with attribution.
                </p>
              )}
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col lg:flex">
        <div className="thin-scroll flex h-full flex-col overflow-y-auto pt-14 pr-4 pb-5">
          {navList()}
        </div>
      </aside>

      {/* Mobile: bottom drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <button
            aria-label="Open menu"
            className="border-border/60 bg-background/70 text-foreground fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium shadow-lg backdrop-blur-md lg:hidden"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </DrawerTrigger>
        <DrawerContent
          className="h-[75vh]"
          onCloseAutoFocus={() => {
            if (pendingScrollId) {
              location.hash = pendingScrollId;
              setPendingScrollId(null);
            }
          }}
        >
          <DrawerTitle className="sr-only">Site navigation</DrawerTitle>
          <Tabs
            defaultValue="navigation"
            className="flex h-full flex-col overflow-hidden"
          >
            <TabsList className="mx-4 mt-2 grid w-auto shrink-0 grid-cols-2">
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="contents">Contents</TabsTrigger>
            </TabsList>
            <TabsContent
              value="navigation"
              className="thin-scroll mt-0 flex-1 overflow-y-auto px-4 pt-2 pb-6"
            >
              {navList(() => setDrawerOpen(false))}
            </TabsContent>
            <TabsContent
              value="contents"
              className="thin-scroll mt-0 flex-1 overflow-y-auto px-4 pt-2 pb-6"
            >
              <TableOfContents
                onLinkClick={(id) => {
                  setPendingScrollId(id);
                  setDrawerOpen(false);
                }}
              />
            </TabsContent>
          </Tabs>
        </DrawerContent>
      </Drawer>
    </>
  );
}
