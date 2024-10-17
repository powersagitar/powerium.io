import { ParagraphBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { P } from '../ui/CommonElements';
import { NotionRichTextItems } from './NotionRichText';

export default function NotionBlockParagraph({
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
