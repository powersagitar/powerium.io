import { EmbedBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Figcaption, Iframe } from '../ui/CommonElements';
import NotionRichTextItems from './rich-text';

export default function NotionBlockEmbed({
  children,
}: {
  children: EmbedBlockObjectResponse;
}) {
  return (
    <>
      <Iframe src={children.embed.url} />
      {children.embed.caption.length > 0 && (
        <Figcaption>
          <NotionRichTextItems baseKey={children.id}>
            {children.embed.caption}
          </NotionRichTextItems>
        </Figcaption>
      )}
    </>
  );
}
