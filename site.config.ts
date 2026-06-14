import type { SiteConfig } from '@/lib/config';

const siteConfig: SiteConfig = {
  name: 'Mohan Dong',
  description: "Mohan's portfolio",
  url: 'https://www.mohandong.com',
  author: 'Mohan Dong',
  repository: 'https://github.com/powersagitar/mssg',
  branch: 'portfolio',

  // RSS feed configuration.
  //
  // 'none'      — feed exists at /rss.xml but contains no items (default)
  // 'all'       — all non-draft published content
  // string[]    — explicit list of paths relative to content/, without
  //               .mdx extension. Supports both files and directories:
  //               'guides'                  → all articles under guides/
  //               'guides/getting-started'  → that specific page only
  rss: ['blog'],
};

export default siteConfig;
