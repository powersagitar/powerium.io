import { MentionRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import NotionDateMention from './NotionDateMention';
import NotionLinkMention, {
  MentionLinkMentionResponse,
} from './NotionLinkMention';
import NotionPageMention from './NotionPageMention';

type NotionMentionRichTextItemProps = {
  mention: MentionRichTextItemResponse | MentionLinkMentionResponse;
};

export default function NotionMentionRichTextItem({
  mention,
}: NotionMentionRichTextItemProps) {
  switch (mention.mention.type) {
    case 'user':
      return <>user</>;

    case 'link_preview':
      return <>link_preview</>;

    case 'link_mention':
      return (
        <NotionLinkMention mention={mention as MentionLinkMentionResponse} />
      );

    case 'date':
      return (
        <NotionDateMention mention={mention as MentionRichTextItemResponse} />
      );

    case 'page':
      return (
        <NotionPageMention mention={mention as MentionRichTextItemResponse} />
      );

    case 'database':
      return <>database</>;

    case 'template_mention':
      return <>template_mention</>;
  }
}
