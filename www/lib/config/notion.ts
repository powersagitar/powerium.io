import 'server-only';

type DatabaseID = string;
type PageID = string;

export type NotionConfig = {
  notionApiKey: string;
  notionDatabaseId: DatabaseID;

  /**
   * @deprecated this value may not be respected and will be remove in a future
   * commit
   */
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
};

export type Pathname = `/${string}`;
