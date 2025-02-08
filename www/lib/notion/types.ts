import 'server-only';

import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

export type NotionPageProperties = {
  title: {
    id: 'title';
    type: 'title';
    title: RichTextItemResponse[];
  };
};

export type NotionBlogPageProperties = NotionPageProperties & {
  published: {
    id: string;
    type: 'date';
    date: {
      start: string;
      end?: string;
      time_zone?: string;
    };
  };

  authors: {
    id: string;
    type: 'rich_text';
    rich_text: RichTextItemResponse[];
  };

  description: {
    id: string;
    type: 'rich_text';
    rich_text: RichTextItemResponse[];
  };
};
