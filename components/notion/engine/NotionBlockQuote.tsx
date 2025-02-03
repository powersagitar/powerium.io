import { QuoteBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Blockquote } from '../../ui/CommonElements';
import { P } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockQuote({
  quote,
}: {
  quote: QuoteBlockObjectResponse;
}) {
  return (
    <Blockquote>
      <P>
        <NotionRichTextItems
          baseKey={quote.id}
          richText={quote.quote.rich_text}
        />
      </P>
    </Blockquote>
  );
}
