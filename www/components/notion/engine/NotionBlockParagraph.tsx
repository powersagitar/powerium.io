import { ParagraphBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { P } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockParagraph({
  paragraph,
}: {
  paragraph: ParagraphBlockObjectResponse;
}) {
  return (
    <P>
      <NotionRichTextItems
        baseKey={paragraph.id}
        richText={paragraph.paragraph.rich_text}
      />
    </P>
  );
}
