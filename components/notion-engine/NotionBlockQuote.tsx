import { QuoteBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Blockquote, P } from '../ui/CommonElements';
import { NotionRichTextItems } from './NotionRichText';

export default function NotionBlockQuote({
  children,
}: {
  children: QuoteBlockObjectResponse;
}) {
  return (
    <Blockquote>
      <P>
        <NotionRichTextItems blockId={children.id}>
          {children.quote.rich_text}
        </NotionRichTextItems>
      </P>
    </Blockquote>
  );
}
