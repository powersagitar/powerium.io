import { SiteConfig } from '@/lib/config/site';

export const siteConfig: SiteConfig = {
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
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
    openGraph: {
      titleLength: 100,
      descriptionLength: 500,
    },
  },

  githubRepository: 'powersagitar/powerium.io',
};
