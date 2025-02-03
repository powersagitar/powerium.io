import { AudioBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

type NotionBlockAudioProps = {
  audio: Readonly<AudioBlockObjectResponse>;
};

export default function NotionBlockAudio({ audio }: NotionBlockAudioProps) {
  if (audio.audio.type === 'file') {
    const url = audio.audio.file.url;
    return <audio controls src={url} className="not-first:mt-6" />;
  } else {
    return null;
  }
}
