import 'server-only';

import { NotionConfig } from '@/lib/config/notion';

export const notionConfig: NotionConfig = {
  notionApiKey: process.env.NOTION_API_KEY!,
  notionDatabaseId: process.env.NOTION_DATABASE_ID!,

  cacheTtl: process.env.NODE_ENV === 'development' ? 1 : 14400,

  auxiliaryPages: {
    about: {
      id: process.env.NOTION_PAGE_ID_ABOUT!,
      description: 'Learn more about @powersagitar.',
    },
    contact: {
      id: process.env.NOTION_PAGE_ID_CONTACT!,
      description: 'Connect with @powersagitar on various platforms.',
    },
  },
};
