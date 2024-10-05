import { EmbedBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Figcaption, Iframe } from '../CommonElements';
import { NotionRichTextItems } from './NotionRichText';

export function NotionBlockEmbed({
  children,
}: {
  children: EmbedBlockObjectResponse;
}) {
  return (
    <>
      <Iframe src={children.embed.url} />
      {children.embed.caption.length > 0 && (
        <Figcaption>
          <NotionRichTextItems blockId={children.id}>
            {children.embed.caption}
          </NotionRichTextItems>
        </Figcaption>
      )}
    </>
  );
}
