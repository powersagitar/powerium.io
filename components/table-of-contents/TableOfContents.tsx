'use client';

import { isBrowser } from 'react-device-detect';

import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { NotionRichTextItems } from '../notion-engine/NotionRichText';
import { Link } from '../ui/CommonElements';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default function TableOfContents({
  children: notionPageHeadings,
}: {
  children: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
}) {
  if (notionPageHeadings.length < 1) {
    return null;
  }

  if (isBrowser) {
    return <Desktop>{notionPageHeadings}</Desktop>;
  } else {
    return <Mobile>{notionPageHeadings}</Mobile>;
  }
}

export function NotionPageHeadingLi({
  children: notionPageHeadings,
}: {
  children: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
}) {
  return notionPageHeadings.map((heading) => {
    switch (heading.type) {
      case 'heading_1':
        return (
          <li className="mb-1.5" key={`toc-${heading.id}`}>
            <Link href={`#${heading.id}`}>
              <NotionRichTextItems blockId={heading.id}>
                {(heading as Heading1BlockObjectResponse).heading_1.rich_text}
              </NotionRichTextItems>
            </Link>
          </li>
        );

      case 'heading_2':
        return (
          <li className="mb-1.5 ml-4" key={`toc-${heading.id}`}>
            <Link href={`#${heading.id}`}>
              <NotionRichTextItems blockId={heading.id}>
                {(heading as Heading2BlockObjectResponse).heading_2.rich_text}
              </NotionRichTextItems>
            </Link>
          </li>
        );

      case 'heading_3':
        return (
          <li className="mb-1.5 ml-8" key={`toc-${heading.id}`}>
            <Link href={`#${heading.id}`}>
              <NotionRichTextItems blockId={heading.id}>
                {(heading as Heading3BlockObjectResponse).heading_3.rich_text}
              </NotionRichTextItems>
            </Link>
          </li>
        );
    }
  });
}
