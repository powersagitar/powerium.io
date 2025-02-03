import { Heading3BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { H4 } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockHeading3({
  heading,
}: {
  heading: Heading3BlockObjectResponse;
}) {
  return (
    <H4 id={heading.id}>
      <NotionRichTextItems
        baseKey={heading.id}
        richText={heading.heading_3.rich_text}
      />
    </H4>
  );
}
