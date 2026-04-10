import type React from 'react';

import type { Metadata } from 'next';

import { BackToHome } from '@/components/BackToHome';
import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'powerium.io',
    template: '%s | powerium.io',
  },
  description: "@powersagitar's personal site.",
  metadataBase: new URL('https://www.powerium.io'),
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
          <div className="mx-auto max-w-3xl px-4 py-12">
            <BackToHome />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
