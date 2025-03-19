import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export function getBlogHref(pageId: PageObjectResponse['id']) {
  return `/blog/${pageId}`;
}
