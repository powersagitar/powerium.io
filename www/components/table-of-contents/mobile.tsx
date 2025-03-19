'use client';

import { useState } from 'react';

import { ActivityLogIcon } from '@radix-ui/react-icons';

import { NotionHeading } from '@/lib/notion/page';

import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import TOCEntries from './entries';

type TOCMobileProps = {
  headings: NotionHeading[];
};

export default function TOCMobile({ headings }: TOCMobileProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} autoFocus={open}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={headings.length < 1}
          onClick={() => setOpen(true)}
        >
          <ActivityLogIcon />
          <span className="sr-only">Open table of contents</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent onClick={() => setOpen(false)} className="pb-4">
        <DrawerHeader>
          <DrawerTitle>Table of Contents</DrawerTitle>
          <DrawerDescription>
            Navigate the flow and uncover every part of the story.
          </DrawerDescription>
        </DrawerHeader>
        <TOCEntries headings={headings} />
      </DrawerContent>
    </Drawer>
  );
}
