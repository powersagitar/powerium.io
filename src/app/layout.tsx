import type React from 'react';

import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import siteConfig from '~/site.config';

import { Sidebar } from '@/components/Sidebar';
import { TableOfContents } from '@/components/mdx/TableOfContents';
import { ThemeProvider } from '@/components/theme-provider';
import { getNavSections } from '@/lib/nav';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = getNavSections();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-auto max-w-350 px-6 lg:grid lg:grid-cols-[240px_1fr_240px] lg:gap-x-8">
            <Sidebar nav={nav} />
            <main className="max-w-190 min-w-0 pt-14 pb-16 lg:col-start-2 lg:row-start-1 lg:py-10">
              {children}
            </main>
            <aside className="thin-scroll sticky top-0 hidden h-screen w-50 shrink-0 overflow-y-auto pt-16 lg:col-start-3 lg:row-start-1 xl:block">
              <TableOfContents />
            </aside>
          </div>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
