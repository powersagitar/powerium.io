import { MentionRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

type NotionLinkMentionProps = {
  mention: MentionRichTextItemResponse;
};

export default function NotionLinkPreview({ mention }: NotionLinkMentionProps) {
  if (mention.mention.type !== 'link_preview') {
    console.error('Non-link_preview mention passed to NotionLinkPreview');
    return <>Non-link_preview mention passed to NotionLinkPreview</>;
  }

  return <>link_preview</>;
}
