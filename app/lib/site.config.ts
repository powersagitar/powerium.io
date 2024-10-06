import 'server-only';

export type SiteConfig = {
  notionApiKey: string;
  notionDatabaseId: string;

  cacheTtl: number;

  url: {
    protocol: 'http' | 'https';
    domain: string;
  };

  metadata: {
    author: { name: string; url?: string };
    title: string;
    description: string;
    keywords?: string[];
  };

  customPages?: Map<
    UrlPath,
    { navTitle: string; description: string; notionPageId: string }
  >;
};

export type UrlPath = `/${string}`;
