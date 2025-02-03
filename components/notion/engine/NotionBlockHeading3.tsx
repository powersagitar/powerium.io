import { Heading3BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { H4 } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockHeading3({
  children,
}: {
  children: Heading3BlockObjectResponse;
}) {
  return (
    <H4 id={children.id}>
      <NotionRichTextItems baseKey={children.id}>
        {children.heading_3.rich_text}
      </NotionRichTextItems>
    </H4>
  );
}
