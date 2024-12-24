'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, SetStateAction, useState } from 'react';

import { NotionHeading, NotionHeadingsContext } from './notion-headings';

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
        {children}
      </NotionHeadingsContext>
    </ThemeProvider>
  );
}
