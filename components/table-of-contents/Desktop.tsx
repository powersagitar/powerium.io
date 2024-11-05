import { useState } from 'react';

import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { ScrollArea } from '../ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Large, Ul } from '../ui/typography';
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
  const [open, setOpen] = useState(false);

  return (
    <aside className="flex fixed top-0 right-0 bottom-0 items-center z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild onMouseEnter={() => setOpen(true)}>
          <span className="[writing-mode:vertical-rl] rounded backdrop-blur">
            Table of Contents
          </span>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              <Large>Table of Contents</Large>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Table of Contents of the current page
            </SheetDescription>
          </SheetHeader>
          <ScrollArea>
            <nav className="flex flex-col backdrop-blur-lg p-4 rounded-2xl max-w-prose max-h-[75vh]">
              <Ul className="my-0" onClick={() => setOpen(false)}>
                <NotionPageHeadingLi>{notionPageHeadings}</NotionPageHeadingLi>
              </Ul>
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </aside>
  );
}
