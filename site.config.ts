import 'server-only';

import { SiteConfig } from '@/lib/site.config';

export const siteConfig: SiteConfig = {
  notionApiKey: process.env.NOTION_API_KEY!,
  notionDatabaseId: process.env.NOTION_DATABASE_ID!,

  cacheTtl: 14400,

  url: {
    protocol: 'https',
    hostname: 'www.powerium.io',
    origin: 'https://www.powerium.io',
  },

  metadata: {
    author: { name: 'powersagitar', url: '/about' },
    title: 'powerium.io',
    description:
      "@powersagitar's blog about software development, productivity, and many more.",
  },

  githubRepository: 'powersagitar/powerium.io',

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
