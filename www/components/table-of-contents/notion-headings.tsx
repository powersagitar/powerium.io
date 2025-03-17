'use client';

import { SetStateAction, createContext, useContext, useEffect } from 'react';

import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export type NotionHeading =
  | Heading1BlockObjectResponse
  | Heading2BlockObjectResponse
  | Heading3BlockObjectResponse;

export const NotionHeadingsContext = createContext<{
  notionHeadings: NotionHeading[];
  setNotionHeadings: (value: SetStateAction<NotionHeading[]>) => void;
}>({ notionHeadings: [], setNotionHeadings: () => {} });

export function ResetNotionHeadings() {
  const { setNotionHeadings } = useContext(NotionHeadingsContext);
  useEffect(() => setNotionHeadings([]), [setNotionHeadings]);

  return null;
}
