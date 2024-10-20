'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function Providers({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
