import { FileBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type NotionBlockFileProps = {
  file: Readonly<FileBlockObjectResponse>;
};

export default function NotionBlockFile({ file }: NotionBlockFileProps) {
  const name = file.file.name;

  if (file.file.type === 'file') {
    const url = new URL(file.file.file.url);
    return <NotionBlockFileRenderer name={name} url={url} />;
  } else {
    const url = new URL(file.file.external.url);
    return <NotionBlockFileRenderer name={name} url={url} />;
  }
}

type NotionBlockFileRendererProps = {
  name: Readonly<string>;
  url: Readonly<URL>;
};

function NotionBlockFileRenderer({ name, url }: NotionBlockFileRendererProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>File</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" asChild>
          <a href={url.href} target="_blank">
            Open in new tab
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
