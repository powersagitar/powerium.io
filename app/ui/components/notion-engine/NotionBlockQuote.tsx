import { QuoteBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Blockquote, P } from '../CommonElements';
import { NotionRichTextItems } from './NotionRichText';

export function NotionBlockQuote({
  children,
}: {
  children: QuoteBlockObjectResponse;
}) {
  return (
    <Blockquote>
      <P className="">
        <NotionRichTextItems blockId={children.id}>
          {children.quote.rich_text}
        </NotionRichTextItems>
      </P>
    </Blockquote>
  );
}
