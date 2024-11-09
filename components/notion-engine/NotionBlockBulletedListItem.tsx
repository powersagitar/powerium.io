import { BulletedListItemBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Li } from '../ui/CommonElements';
import { Ul } from '../ui/typography';
import { NotionRichTextItems } from './NotionRichText';

export default function NotionBlockBulletedListItem({
  children,
}: {
  children: BulletedListItemBlockObjectResponse;
}) {
  return (
    <Ul className="my-0">
      <Li>
        <NotionRichTextItems baseKey={children.id}>
          {children.bulleted_list_item.rich_text}
        </NotionRichTextItems>
      </Li>
    </Ul>
  );
}
