'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ExternalLink, Menu } from 'lucide-react';
import siteConfig from '~/site.config';

import type { NavSection } from '@/lib/nav';

export function Sidebar({ nav }: { nav: NavSection[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  }

  const navContent = (
    <div className="thin-scroll flex h-full flex-col overflow-y-auto pt-14 pr-4 pb-5">
      <div className="mb-8 px-2.5">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="bg-foreground text-background inline-flex h-6 w-6 items-center justify-center rounded-[6px] font-mono text-[11px] font-bold tracking-[-0.04em]">
            {siteConfig.name[0]}
          </span>
          <span className="text-sm font-semibold tracking-[-0.015em]">
            {siteConfig.name}
          </span>
        </Link>
      </div>

      {nav.map((section) => (
        <div key={section.label} className="mb-5">
          <div className="text-muted-foreground mb-1.5 px-2.5 text-[11px] font-semibold tracking-[0.05em] uppercase">
            {section.label}
          </div>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
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

      {(siteConfig.repository || siteConfig.author) && (
        <>
          <div className="border-border mx-2.5 my-3 border-t" />
          <div className="text-muted-foreground flex flex-col gap-1 px-2.5 text-xs">
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
                Copyright &copy; {new Date().getFullYear()} {siteConfig.author}.
                Share with attribution.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col lg:flex">
        {navContent}
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`bg-background border-border fixed inset-y-0 left-0 z-50 w-70 border-r transition-transform duration-200 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
        className="border-border bg-background text-foreground fixed top-3 left-3 z-60 flex h-9 w-9 items-center justify-center rounded-lg border shadow-sm lg:hidden"
      >
        <Menu size={18} />
      </button>
    </>
  );
}
