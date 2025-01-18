import { MentionRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import NotionDateMention from './NotionDateMention';

type NotionMentionRichTextItemProps = {
  mention: MentionRichTextItemResponse;
};

export default function NotionMentionRichTextItem({
  mention,
}: NotionMentionRichTextItemProps) {
  // console.log(mention);

  switch (mention.mention.type) {
    case 'user':
      return <>user</>;

    case 'link_preview':
      return <>link_preview</>;

    case 'date':
      return <NotionDateMention mention={mention} />;

    case 'page':
      return <>page</>;

    case 'database':
      return <>database</>;

    case 'template_mention':
      return <>template_mention</>;
  }
}
