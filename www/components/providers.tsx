'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

import { Toaster } from './ui/toaster';

type ProviderProps = { children: Readonly<ReactNode> };

export default function Providers({ children }: ProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      {children}
    </ThemeProvider>
  );
}
