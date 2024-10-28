import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { H2, Ul } from '../ui/typography';
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
    <Collapsible>
      <CollapsibleTrigger className="w-full">
        <H2>
          <span className="flex justify-between">
            Table of Contents&nbsp;
            <ChevronUpDownIcon className="h-[1em] w-[1em] inline" />
          </span>
        </H2>
        <span className="sr-only">Toggle</span>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Ul>
          <NotionPageHeadingLi>{notionPageHeadings}</NotionPageHeadingLi>
        </Ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
