import { VideoBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

type NotionBlockVideoProps = {
  video: Readonly<VideoBlockObjectResponse>;
};

export default function NotionBlockVideo({ video }: NotionBlockVideoProps) {
  if (video.video.type === 'file') {
    const url = video.video.file.url;
    return <video controls src={url} className="not-first:mt-6 rounded" />;
  } else {
    // const url = video.video.external.url;
    // return (
    //   <iframe
    //     src={url}
    //     loading="lazy"
    //     className="not-first:mt-6 rounded"
    //   />
    // );
    return null;
  }
}
