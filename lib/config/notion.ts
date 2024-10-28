import 'server-only';

export type NotionConfig = {
  notionApiKey: string;
  notionDatabaseId: string;

  cacheTtl: number;

  customPages?: Map<
    Pathname,
    { navTitle: string; description: string; notionPageId: string }
  >;
};

export type Pathname = `/${string}`;
