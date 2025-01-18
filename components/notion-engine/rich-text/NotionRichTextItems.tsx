import { JSX } from 'react';

import {
  EquationRichTextItemResponse,
  MentionRichTextItemResponse,
  RichTextItemResponse,
  TextRichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

import NotionEquationRichTextItem from '@/components/notion-engine/rich-text/NotionEquationRichTextItem';
import NotionTextRichTextItem from '@/components/notion-engine/rich-text/NotionTextRichTextItem';
import NotionMentionRichTextItem from '@/components/notion-engine/rich-text/mention/NotionMentionRichTextItem';

export default function NotionRichTextItems({
  baseKey,
  children: notionRichText,
}: {
  baseKey: string;
  children: RichTextItemResponse[];
}) {
  return notionRichText.map((richTextItem, idx) => {
    type Renderers = {
      [key in RichTextItemResponse['type']]: JSX.Element;
    };

    const renderers: Renderers = {
      text: (
        <NotionTextRichTextItem
          key={`rich-text-${baseKey}-${idx}`}
          text={richTextItem as TextRichTextItemResponse}
        />
      ),

      mention: (
        <NotionMentionRichTextItem
          key={`rich-text-${baseKey}-${idx}`}
          mention={richTextItem as MentionRichTextItemResponse}
        />
      ),

      equation: (
        <NotionEquationRichTextItem
          key={`rich-text-${baseKey}-${idx}`}
          equation={richTextItem as EquationRichTextItemResponse}
        />
      ),
    };

    return renderers[richTextItem.type];
  });
}
