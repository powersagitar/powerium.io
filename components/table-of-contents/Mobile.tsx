import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { H2, Hr } from '../ui/CommonElements';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
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
      <Collapsible>
        <CollapsibleTrigger>
          <H2>
            Table of Contents&nbsp;
            <ChevronUpDownIcon className="h-[1em] w-[1em] inline" />
          </H2>
          <span className="sr-only">Toggle</span>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <ul className="list-disc list-inside mb-5">
            <NotionPageHeadingLi>{notionPageHeadings}</NotionPageHeadingLi>
          </ul>
        </CollapsibleContent>
      </Collapsible>

      <Hr />
    </>
  );
}
