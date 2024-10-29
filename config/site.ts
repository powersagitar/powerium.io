import { SiteConfig } from '@/lib/config/site';

export const siteConfig: SiteConfig = {
  name: 'powerium.io',

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
};
