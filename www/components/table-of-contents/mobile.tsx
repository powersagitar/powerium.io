'use client';

import { useContext, useState } from 'react';

import { ActivityLogIcon } from '@radix-ui/react-icons';

import { NotionHeadingsContext } from '../contexts/notion-headings';
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

export default function TOCMobile() {
  const { notionHeadings } = useContext(NotionHeadingsContext);
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} autoFocus={open}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={notionHeadings.length < 1}
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
        <TOCEntries />
      </DrawerContent>
    </Drawer>
  );
}
