import { MentionRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { Link } from '@/components/ui/link';

type NotionPageMentionProps = {
  mention: MentionRichTextItemResponse;
};

export default function NotionPageMention({ mention }: NotionPageMentionProps) {
  if (mention.mention.type !== 'page') {
    console.error('Non-page mention passed to NotionPageMention');
    return <>Non-date mention passed to NotionPageMention</>;
  }

  const pageTitle = mention.plain_text;
  const pageId = mention.mention.page.id;

  return <Link href={`/${pageId}`}>{pageTitle}</Link>;
}
