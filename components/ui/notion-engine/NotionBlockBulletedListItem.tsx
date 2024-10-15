import { BulletedListItemBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Li } from '../CommonElements';
import { NotionRichTextItems } from './NotionRichText';

export default function NotionBlockBulletedListItem({
  children,
}: {
  children: BulletedListItemBlockObjectResponse;
}) {
  return (
    <ul>
      <Li>
        <NotionRichTextItems blockId={children.id}>
          {children.bulleted_list_item.rich_text}
        </NotionRichTextItems>
      </Li>
    </ul>
  );
}
