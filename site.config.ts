import type { SiteConfig } from '@/lib/config';

const siteConfig: SiteConfig = {
  name: 'mSSG',
  description:
    'A minimal, file-based static site generator based on Next.js and MDX.',
  url: 'https://mssg.mohandong.com',
  author: 'Mohan Dong',
  repository: 'https://github.com/powersagitar/mssg',
  branch: 'main',

  // RSS feed configuration.
  //
  // 'none'      — feed exists at /rss.xml but contains no items (default)
  // 'all'       — all published content
  // string[]    — explicit list of paths relative to content/, without
  //               .mdx extension. Supports both files and directories:
  //               'guides'                  → all articles under guides/
  //               'guides/getting-started'  → that specific page only
  rss: 'none',
};

export default siteConfig;
