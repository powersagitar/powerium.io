import 'server-only';

type DatabaseID = string;
type PageID = string;

export type NotionConfig = {
  notionApiKey: string;
  notionDatabaseId: DatabaseID;

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
