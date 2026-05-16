import type React from 'react';

import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import siteConfig from '~/site.config';

import { Sidebar } from '@/components/Sidebar';
import { TableOfContents } from '@/components/mdx/TableOfContents';
import { ThemeProvider } from '@/components/theme-provider';

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-auto flex max-w-350 gap-8 px-6">
            <Sidebar />
            <main className="max-w-190 min-w-0 flex-1 pt-14 pb-16 lg:py-10">
              {children}
            </main>
            <aside className="thin-scroll sticky top-0 hidden h-screen w-50 shrink-0 overflow-y-auto pt-10 xl:block">
              <TableOfContents />
            </aside>
          </div>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
