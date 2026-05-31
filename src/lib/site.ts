export type RssConfig = {
  include: 'none' | 'all' | string[];
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  author?: string;
  repository?: string;
  branch?: string;
  rss?: RssConfig;
};
