import { EmbedBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Figcaption, Iframe } from '../../ui/CommonElements';
import NotionRichTextItems from './rich-text';

export default function NotionBlockEmbed({
  embed,
}: {
  embed: EmbedBlockObjectResponse;
}) {
  return (
    <>
      <Iframe src={embed.embed.url} />
      {embed.embed.caption.length > 0 && (
        <Figcaption>
          <NotionRichTextItems
            baseKey={embed.id}
            richText={embed.embed.caption}
          />
        </Figcaption>
      )}
    </>
  );
}
