import { ImageBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

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
      <img
        src={image.image.external.url}
        width={1920}
        height={1080}
        alt={caption.length > 0 ? caption : 'Image loaded from Notion'}
        className="[&:not(:first-child)]:mt-6"
      />
    );
  }
}
