import { JSX } from 'react';

import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { Code } from '@/components/ui/typography';

type NotionRichTextAnnotationsProps = {
  annotations: RichTextItemResponse['annotations'];
  children: JSX.Element;
};

export default function NotionRichTextAnnotations({
  annotations,
  children,
}: NotionRichTextAnnotationsProps) {
  if (annotations.bold) {
    children = <strong>{children}</strong>;
  }

  if (annotations.code) {
    children = <Code>{children}</Code>;
  }

  if (annotations.color) {
    // TODO: not implemented
  }

  if (annotations.italic) {
    children = <em>{children}</em>;
  }

  if (annotations.strikethrough) {
    children = <s>{children}</s>;
  }

  if (annotations.underline) {
    children = <u>{children}</u>;
  }

  return children;
}
