import {
  RichTextItemResponse,
  TextRichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { Link } from '../ui/link';
import { Code } from '../ui/typography';

export function NotionRichTextItems({
  blockId,
  children: notionRichText,
}: {
  blockId: string;
  children: RichTextItemResponse[];
}) {
  return (
    <>
      {notionRichText.map((richTextItem, idx) => {
        switch (richTextItem.type) {
          case 'text':
            return (
              <NotionTextRichTextItem key={`rich-text-${blockId}-${idx}`}>
                {richTextItem}
              </NotionTextRichTextItem>
            );

          default:
            return null;
        }
      })}
    </>
  );
}

function NotionTextRichTextItem({
  children: textRichTextItem,
}: {
  children: TextRichTextItemResponse;
}) {
  let element = <>{textRichTextItem.plain_text}</>;

  if (textRichTextItem.annotations.bold) {
    element = <strong>{element}</strong>;
  }

  if (textRichTextItem.annotations.code) {
    element = <Code>{element}</Code>;
  }

  if (textRichTextItem.annotations.color) {
    // TODO: not implemented
  }

  if (textRichTextItem.annotations.italic) {
    element = <em>{element}</em>;
  }

  if (textRichTextItem.annotations.strikethrough) {
    element = <s>{element}</s>;
  }

  if (textRichTextItem.annotations.underline) {
    element = <u>{element}</u>;
  }

  if (textRichTextItem.text.link) {
    element = <Link href={textRichTextItem.text.link.url}>{element}</Link>;
  }

  return element;
}
