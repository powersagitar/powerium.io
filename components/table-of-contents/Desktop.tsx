import { useState } from 'react';

import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { Ul } from '../ui/CommonElements';
import { Separator } from '../ui/separator';
import { NotionPageHeadingLi } from './TableOfContents';

export default function Desktop({
  children: notionPageHeadings,
}: {
  children: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
}) {
  const [displayTocSidebar, setDisplayTocPanel] = useState(false);

  return (
    <aside className="flex fixed top-0 right-0 bottom-0 items-center z-50">
      {displayTocSidebar ? (
        <div onMouseLeave={() => setDisplayTocPanel(false)}>
          <Sidebar>{notionPageHeadings}</Sidebar>
        </div>
      ) : (
        <div onMouseEnter={() => setDisplayTocPanel(true)}>
          <Hint />
        </div>
      )}
    </aside>
  );
}

function Hint() {
  return (
    <div className="flex">
      <span className="[writing-mode:vertical-rl] py-3 rounded-l-lg backdrop-blur">
        Table of Contents
      </span>
    </div>
  );
}

function Sidebar({
  children: notionPageHeadings,
}: {
  children: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
}) {
  return (
    <nav className="flex flex-col backdrop-blur-lg p-4 rounded-2xl max-w-prose max-h-[75vh]">
      <h1 className="self-center font-medium">Table of Contents</h1>

      <Separator className="my-2" />

      <Ul styles={{ my: 'my-0' }}>
        <NotionPageHeadingLi>{notionPageHeadings}</NotionPageHeadingLi>
      </Ul>
    </nav>
  );
}
