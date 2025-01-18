import { MentionRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import NotionDateMention from './NotionDateMention';
import NotionPageMention from './NotionPageMention';

type NotionMentionRichTextItemProps = {
  mention: MentionRichTextItemResponse;
};

export default function NotionMentionRichTextItem({
  mention,
}: NotionMentionRichTextItemProps) {
  switch (mention.mention.type) {
    case 'user':
      return <>user</>;

    case 'link_preview':
      return <>link_preview</>;

    case 'date':
      return <NotionDateMention mention={mention} />;

    case 'page':
      return <NotionPageMention mention={mention} />;

    case 'database':
      return <>database</>;

    case 'template_mention':
      return <>template_mention</>;
  }
}
