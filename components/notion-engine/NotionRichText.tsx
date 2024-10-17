import {
  RichTextItemResponse,
  TextRichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { Link } from '../ui/CommonElements';

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
    element = <code>{element}</code>;
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
    element = (
      <Link
        href={textRichTextItem.text.link.url}
        textDecoration="underline"
        className="hover:text-blue-600 dark:hover:text-blue-500"
      >
        {element}
      </Link>
    );
  }

  return element;
}
