import { QuoteBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Blockquote } from '../../ui/CommonElements';
import { P } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockQuote({
  children,
}: {
  children: QuoteBlockObjectResponse;
}) {
  return (
    <Blockquote>
      <P>
        <NotionRichTextItems baseKey={children.id}>
          {children.quote.rich_text}
        </NotionRichTextItems>
      </P>
    </Blockquote>
  );
}
