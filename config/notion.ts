import 'server-only';

import { NotionConfig } from '@/lib/config/notion';

export const notionConfig: NotionConfig = {
  notionApiKey: process.env.NOTION_API_KEY!,
  notionDatabaseId: process.env.NOTION_DATABASE_ID!,

  cacheTtl: process.env.NODE_ENV === 'development' ? 1 : 14400,

  customPages: new Map([
    [
      '/about',
      {
        navTitle: 'About',
        description: 'Learn more about @powersagitar.',
        notionPageId: process.env.NOTION_PAGE_ID_ABOUT!,
      },
    ],
    [
      '/contact',
      {
        navTitle: 'Contact',
        description: 'Connect with @powersagitar on various platforms.',
        notionPageId: process.env.NOTION_PAGE_ID_CONTACT!,
      },
    ],
  ]),
};
