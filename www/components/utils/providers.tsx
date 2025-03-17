'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, SetStateAction, useState } from 'react';

import {
  NotionHeading,
  NotionHeadingsContext,
} from '../table-of-contents/notion-headings';
import { Toaster } from '../ui/toaster';

type ProviderProps = { children: Readonly<ReactNode> };

export default function Providers({ children }: ProviderProps) {
  const [notionHeadings, setNotionHeadings] = useState<NotionHeading[]>([]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NotionHeadingsContext
        value={{
          notionHeadings,
          setNotionHeadings: (value: SetStateAction<NotionHeading[]>) =>
            setNotionHeadings(value),
        }}
      >
        <Toaster />
        {children}
      </NotionHeadingsContext>
    </ThemeProvider>
  );
}
