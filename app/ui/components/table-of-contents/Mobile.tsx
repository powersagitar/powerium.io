import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { H2, Hr } from '../CommonElements';
import { NotionPageHeadingLi } from './TableOfContents';

export default function Mobile({
  children: notionPageHeadings,
}: {
  children: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
}) {
  return (
    <>
      <H2>Table of Contents</H2>

      <ul className="list-disc list-inside mt-4">
        <NotionPageHeadingLi>{notionPageHeadings}</NotionPageHeadingLi>
      </ul>

      <Hr />
    </>
  );
}
