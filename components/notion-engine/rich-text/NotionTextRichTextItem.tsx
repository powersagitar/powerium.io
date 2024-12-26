import { TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import NotionRichTextAnnotations from '@/components/notion-engine/rich-text/NotionRichTextAnnotations';
import { Link } from '@/components/ui/link';

type NotionTextRichTextItemProps = {
  text: Readonly<TextRichTextItemResponse>;
};

export default function NotionTextRichTextItem({
  text,
}: NotionTextRichTextItemProps) {
  if (text.text.link) {
    const { url } = text.text.link;
    return (
      <NotionRichTextAnnotations annotations={text.annotations}>
        <Link href={url}>{text.text.content}</Link>
      </NotionRichTextAnnotations>
    );
  } else {
    return (
      <NotionRichTextAnnotations annotations={text.annotations}>
        <>{text.text.content}</>
      </NotionRichTextAnnotations>
    );
  }
}
