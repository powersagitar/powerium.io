import 'server-only';

export type SiteConfig = {
  notionApiKey: string;
  notionDatabaseId: string;

  cacheTtl: number;

  url: {
    protocol: 'http' | 'https';
    hostname: string;
    origin: `${'http' | 'https'}://${string}`;
  };

  metadata: {
    author: { name: string; url?: string };
    title: string;
    description: string;
    keywords?: string[];
  };

  customPages?: Map<
    Pathname,
    { navTitle: string; description: string; notionPageId: string }
  >;
};

export type Pathname = `/${string}`;
