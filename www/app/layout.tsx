import 'server-only';

import { Metadata } from 'next';
import React from 'react';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import Breadcrumb from '@/components/breadcrumb';
import Providers from '@/components/contexts/providers';
import Footer from '@/components/footer';
import Toolbar from '@/components/toolbar';
import { siteConfig } from '@/config/site';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: siteConfig.metadata.title,
  description: siteConfig.metadata.description,
  generator: 'Next.js',
  applicationName: siteConfig.metadata.title,
  referrer: 'origin-when-cross-origin',
  keywords: siteConfig.metadata.keywords,
  authors: [siteConfig.metadata.author],
  icons: siteConfig.metadata.icons,
  metadataBase: new URL(siteConfig.url.origin),
};

type RootLayoutProps = { children: Readonly<React.ReactNode> };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="flex min-h-screen w-full flex-col items-center transition">
        <Providers>
          <Breadcrumb className="hidden sm:block" />

          <main className="mt-22 flex w-full grow flex-col px-3 lg:w-2/3">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>

          {/* margin is to make room for toolbar, which appears on the bottom of mobile devices */}
          <Footer className="flex w-full flex-col items-center pt-22 pb-14 text-center sm:pb-3" />

          <Toolbar className="flex sm:hidden" />
        </Providers>
      </body>
    </html>
  );
}
