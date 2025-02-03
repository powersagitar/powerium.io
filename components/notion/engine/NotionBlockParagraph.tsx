import { ParagraphBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { P } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockParagraph({
  children,
}: {
  children: ParagraphBlockObjectResponse;
}) {
  return (
    <P>
      <NotionRichTextItems baseKey={children.id}>
        {children.paragraph.rich_text}
      </NotionRichTextItems>
    </P>
  );
}
