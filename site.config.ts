import type { SiteConfig } from '@/lib/config';

const siteConfig: SiteConfig = {
  name: 'powerium.io',
  description: "powersagitar's portfolio",
  url: 'https://www.powerium.io',
  author: 'powersagitar',
  repository: 'https://github.com/powersagitar/mssg',
  branch: 'powerium.io',

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
