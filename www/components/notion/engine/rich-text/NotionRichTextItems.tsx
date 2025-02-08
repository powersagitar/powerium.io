import { JSX } from 'react';

import {
  EquationRichTextItemResponse,
  MentionRichTextItemResponse,
  RichTextItemResponse,
  TextRichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

import NotionEquationRichTextItem from '@/components/notion/engine/rich-text/NotionEquationRichTextItem';
import NotionTextRichTextItem from '@/components/notion/engine/rich-text/NotionTextRichTextItem';
import NotionMentionRichTextItem from '@/components/notion/engine/rich-text/mention';

export default function NotionRichTextItems({
  baseKey,
  richText,
}: {
  baseKey: string;
  richText: RichTextItemResponse[];
}) {
  return richText.map((richText, idx) => {
    type Renderers = {
      [key in RichTextItemResponse['type']]: JSX.Element;
    };

    const renderers: Renderers = {
      text: (
        <NotionTextRichTextItem
          key={`rich-text-${baseKey}-${idx}`}
          text={richText as TextRichTextItemResponse}
        />
      ),

      mention: (
        <NotionMentionRichTextItem
          key={`rich-text-${baseKey}-${idx}`}
          mention={richText as MentionRichTextItemResponse}
        />
      ),

      equation: (
        <NotionEquationRichTextItem
          key={`rich-text-${baseKey}-${idx}`}
          equation={richText as EquationRichTextItemResponse}
        />
      ),
    };

    return renderers[richText.type];
  });
}
