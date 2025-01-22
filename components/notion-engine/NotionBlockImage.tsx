import { ImageBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { ImageWithFallback } from '../ui/image-with-fallback';

export default function NotionBlockImage({
  image,
}: {
  image: ImageBlockObjectResponse;
}) {
  const caption = image.image.caption
    .map((richText) => richText.plain_text)
    .join('');

  if (image.image.type === 'external') {
    return (
      <ImageWithFallback
        src={image.image.external.url}
        width={1920}
        height={1080}
        alt={caption.length > 0 ? caption : 'Image loaded from Notion'}
        className="my-6 rounded"
      />
    );
  }
}
