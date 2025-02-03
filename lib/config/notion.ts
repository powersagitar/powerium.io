import 'server-only';

type DatabaseID = string;
type PageID = string;

export type NotionConfig = {
  notionApiKey: string;
  notionDatabaseId: DatabaseID;

  cacheTtl: number;

  auxiliaryPages: {
    about?: {
      id: PageID;
      description: string;
    };
    contact?: {
      id: PageID;
      description: string;
    };
  };

  customPages?: Map<
    Pathname,
    { navTitle: string; description: string; notionPageId: string }
  >;
};

export type Pathname = `/${string}`;
