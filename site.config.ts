import 'server-only';

import { SiteConfig } from '@/app/lib/site.config';

export const siteConfig: SiteConfig = {
  notionApiKey: process.env.NOTION_API_KEY!,
  notionDatabaseId: process.env.NOTION_DATABASE_ID!,

  cacheTtl: 14400,

  metadata: {
    author: { name: 'powersagitar', url: '/about' },
    title: 'powerium.io',
    description:
      "@powersagitar's blog about software development, productivity, and many more.",
  },

  customPages: new Map([
    [
      '/about',
      {
        navTitle: 'About',
        description: 'Learn more about @powersagitar.',
        notionPageId: '1165f284f8a48038b2d0f9fb602cd7b1',
      },
    ],
    [
      '/connections',
      {
        navTitle: 'Connections',
        description: 'Connect with @powersagitar on various platforms.',
        notionPageId: '1165f284f8a4802bb3e6fb94e2bc6959',
      },
    ],
  ]),
};
