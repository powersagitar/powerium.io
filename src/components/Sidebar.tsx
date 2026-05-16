'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ExternalLink, Github, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const NAV = [
  {
    label: 'Getting Started',
    items: [{ href: '/', title: 'Overview' }],
  },
  {
    label: 'Guides',
    items: [
      { href: '/guides/getting-started', title: 'Getting Started' },
      { href: '/guides/writing-content', title: 'Writing Content' },
      { href: '/guides/customization', title: 'Customization' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { href: '/reference/configuration', title: 'Configuration' },
      { href: '/reference/frontmatter', title: 'Frontmatter' },
      { href: '/reference/mdx-directives', title: 'MDX Directives' },
    ],
  },
  {
    label: 'Directives',
    items: [
      { href: '/directives/article-list', title: 'article-list' },
      { href: '/directives/callout', title: 'callout' },
      { href: '/directives/progress-bar', title: 'progress-bar' },
      { href: '/directives/spacer', title: 'spacer' },
      { href: '/directives/table-of-contents', title: 'table-of-contents' },
      { href: '/directives/timeline', title: 'timeline' },
    ],
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const isDark = resolvedTheme === 'dark';

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  }

  const navContent = (
    <div className="thin-scroll flex h-full flex-col overflow-y-auto py-5 pr-4">
      <div className="mb-4 flex items-center gap-2 px-2.5">
        <Link
          href="/"
          className="flex flex-1 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="bg-foreground text-background inline-flex h-6 w-6 items-center justify-center rounded-[6px] font-mono text-[11px] font-bold tracking-[-0.04em]">
            m
          </span>
          <span className="text-sm font-semibold tracking-[-0.015em]">
            mSSG
          </span>
        </Link>
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="border-border text-muted-foreground hover:text-foreground inline-flex h-7 w-7 items-center justify-center rounded-md border bg-transparent transition-colors"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <a
          href="https://github.com/powersagitar/mssg"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="border-border text-muted-foreground hover:text-foreground inline-flex h-7 w-7 items-center justify-center rounded-md border bg-transparent transition-colors"
        >
          <Github size={14} />
        </a>
      </div>

      {NAV.map((section) => (
        <div key={section.label} className="mb-5">
          <div className="text-muted-foreground mb-1.5 px-2.5 text-[11px] font-semibold tracking-[0.05em] uppercase">
            {section.label}
          </div>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {section.items.map((item) => {
              const active = isActive(item.href);
              const isDirective = section.label === 'Directives';
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
                    {isDirective && (
                      <span className="text-muted-foreground font-mono text-xs">
                        ::
                      </span>
                    )}
                    <span
                      className={
                        isDirective ? 'font-mono text-[12.5px]' : undefined
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

      <div className="border-border mx-2.5 my-3 border-t" />

      <div className="mb-3.5 px-2.5">
        <div className="border-border text-muted-foreground rounded-lg border border-dashed p-3 text-xs leading-relaxed">
          <div className="text-foreground mb-1 flex items-center gap-1.5 font-semibold">
            <span className="font-mono text-[11px]">::nav</span>
            <span className="border-border inline-flex items-center rounded-full border px-1.5 py-0 text-[9.5px] font-medium">
              planned
            </span>
          </div>
          To make this sidebar MDX-driven, add a{' '}
          <code className="text-[11px]">::nav</code> directive.
        </div>
      </div>

      <div className="px-2.5">
        <a
          href="https://mssg.powerium.io"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 py-1.5 text-xs transition-colors"
        >
          <span>mssg.powerium.io</span>
          <ExternalLink size={11} />
        </a>
      </div>
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
