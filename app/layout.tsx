import 'server-only';

import { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/react';

import { Nav } from '@/components/Nav';
import { Link } from '@/components/ui/CommonElements';
import { siteConfig } from '@/site.config';
import '@/stylesheets/global.css';

export const metadata: Metadata = {
  title: siteConfig.metadata.title,
  description: siteConfig.metadata.description,
  generator: 'Next.js',
  applicationName: siteConfig.metadata.title,
  referrer: 'origin-when-cross-origin',
  keywords: siteConfig.metadata.keywords,
  authors: [siteConfig.metadata.author],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex min-h-screen flex-col items-center mx-4 bg-white text-black dark:bg-black dark:text-white">
        <header className="fixed left-0 right-0 top-0 flex-col items-center backdrop-blur-md z-50">
          <Nav />
        </header>

        <main className="my-20 flex w-full lg:w-2/3 grow flex-col items-center justify-center">
          {children}
          <Analytics />
        </main>

        <footer className="flex flex-col items-center py-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>
            Copyright &copy; {new Date().getUTCFullYear()}{' '}
            <Link href={siteConfig.metadata.author.url ?? '/'}>
              <strong>{siteConfig.metadata.author.name}</strong>
            </Link>
          </p>
          <p>
            {/* spans for line breaking: https://stackoverflow.com/a/24357132/20143641 */}
            <span className="inline-block">Contents are licensed under</span>{' '}
            <span className="inline-block">
              <Link href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">
                <strong>CC BY-SA 4.0</strong>
              </Link>
            </span>{' '}
            <span className="inline-block">unless otherwise noted.</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
