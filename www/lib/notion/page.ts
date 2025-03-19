import { cache } from 'react';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { retrieveNotionBlockChildrenAll } from '@/lib/notion/queries';

export function getBlogHref(pageId: PageObjectResponse['id']) {
  return `/blog/${pageId}`;
}

export type NotionHeading =
  | Heading1BlockObjectResponse
  | Heading2BlockObjectResponse
  | Heading3BlockObjectResponse;

export const getNotionHeadings = cache(async (id: string) => {
  const childBlocks = await retrieveNotionBlockChildrenAll(id);

  return childBlocks.filter(
    ({ type }) =>
      type === 'heading_1' || type === 'heading_2' || type === 'heading_3',
  ) as NotionHeading[];
});
