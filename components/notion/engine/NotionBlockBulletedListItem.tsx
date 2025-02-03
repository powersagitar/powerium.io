import { BulletedListItemBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Li } from '../../ui/CommonElements';
import { Ul } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockBulletedListItem({
  bulletedListItem,
}: {
  bulletedListItem: BulletedListItemBlockObjectResponse;
}) {
  return (
    <Ul className="my-0">
      <Li>
        <NotionRichTextItems
          baseKey={bulletedListItem.id}
          richText={bulletedListItem.bulleted_list_item.rich_text}
        />
      </Li>
    </Ul>
  );
}
