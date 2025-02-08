import { Heading1BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { H2 } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockHeading1({
  heading,
}: {
  heading: Heading1BlockObjectResponse;
}) {
  return (
    <H2 id={heading.id}>
      <NotionRichTextItems
        baseKey={heading.id}
        richText={heading.heading_1.rich_text}
      />
    </H2>
  );
}
