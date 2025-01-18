import Image from 'next/image';

import { MentionRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { Link2Icon } from '@radix-ui/react-icons';

import { Link } from '@/components/ui/link';

export type MentionLinkMentionResponse = {
  annotations: MentionRichTextItemResponse['annotations'];
  href: MentionRichTextItemResponse['href'];
  plain_text: MentionRichTextItemResponse['plain_text'];
  type: MentionRichTextItemResponse['type'];
  mention: {
    type: 'link_mention';
    link_mention: {
      description: string;
      href: string;
      icon_url: string;
      link_provider: string;
      thumbnail_url: string;
      title: string;
    };
  };
};

type NotionLinkMentionProps = {
  mention: MentionLinkMentionResponse;
};

export default function NotionLinkMention({ mention }: NotionLinkMentionProps) {
  if (mention.mention.type !== 'link_mention') {
    console.error('Non-link_mention mention passed to NotionLinkMention');
    return <>Non-link_mention mention passed to NotionLinkMention</>;
  }

  const { title, href, icon_url, link_provider } = mention.mention.link_mention;

  return (
    <Link
      href={href}
      className="inline-flex items-center align-middle no-underline"
    >
      <span className="mr-1">
        {icon_url ? (
          <Image
            src={icon_url}
            alt="Notion link preview icon"
            height={22}
            width={22}
          />
        ) : (
          <Link2Icon height={18} width={18} />
        )}
      </span>
      <span className="mr-1 text-muted-foreground">
        {link_provider ?? new URL(href).host}
      </span>
      <span className="underline">{title}</span>
    </Link>
  );
}
