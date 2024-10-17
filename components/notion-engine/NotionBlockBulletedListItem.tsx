import { BulletedListItemBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Li, Ul } from '../ui/CommonElements';
import { NotionRichTextItems } from './NotionRichText';

export default function NotionBlockBulletedListItem({
  children,
}: {
  children: BulletedListItemBlockObjectResponse;
}) {
  return (
    <Ul styles={{ my: 'my-0' }}>
      <Li>
        <NotionRichTextItems blockId={children.id}>
          {children.bulleted_list_item.rich_text}
        </NotionRichTextItems>
      </Li>
    </Ul>
  );
}
