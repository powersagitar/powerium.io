import { NumberedListItemBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Ul } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockNumberedListItem({
  numberedListItem,
}: {
  numberedListItem: NumberedListItemBlockObjectResponse;
}) {
  return (
    <Ul>
      <li>
        <NotionRichTextItems baseKey={numberedListItem.id}>
          {numberedListItem.numbered_list_item.rich_text}
        </NotionRichTextItems>
      </li>
    </Ul>
  );
}
