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

  const src =
    image.image.type === 'external'
      ? image.image.external.url
      : image.image.file.url;

  const alt = caption.length > 0 ? caption : 'Image from Notion';

  // see below for how to make next/image same size as original
  // https://stackoverflow.com/a/76008677/20143641
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      width={1024}
      height={1024}
      className="my-6 h-auto w-auto rounded"
    />
  );
}
