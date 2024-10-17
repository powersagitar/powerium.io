import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { H2, Hr } from '../ui/CommonElements';
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
      <details>
        <summary>
          <span className="inline-block">
            <H2>Table of Contents</H2>
          </span>
        </summary>

        <ul className="list-disc list-inside mb-5">
          <NotionPageHeadingLi>{notionPageHeadings}</NotionPageHeadingLi>
        </ul>
      </details>

      <Hr />
    </>
  );
}
