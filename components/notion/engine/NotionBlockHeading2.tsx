import { Heading2BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { H3 } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockHeading2({
  heading,
}: {
  heading: Heading2BlockObjectResponse;
}) {
  return (
    <H3 id={heading.id}>
      <NotionRichTextItems
        baseKey={heading.id}
        richText={heading.heading_2.rich_text}
      />
    </H3>
  );
}
