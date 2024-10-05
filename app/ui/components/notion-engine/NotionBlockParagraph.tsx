import { ParagraphBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { P } from '../CommonElements';
import { NotionRichTextItems } from './NotionRichText';

export function NotionBlockParagraph({
  children,
}: {
  children: ParagraphBlockObjectResponse;
}) {
  return (
    <P>
      <NotionRichTextItems blockId={children.id}>
        {children.paragraph.rich_text}
      </NotionRichTextItems>
    </P>
  );
}
