'use client';

import { useContext, useState } from 'react';

import { ActivityLogIcon } from '@radix-ui/react-icons';

import { NotionHeadingsContext } from '../contexts/notion-headings';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import TOCEntries from './entries';

export default function TOCMobile() {
  const { notionHeadings } = useContext(NotionHeadingsContext);
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          disabled={notionHeadings.length < 1}
          onClick={() => setOpen(true)}
        >
          <ActivityLogIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mb-6" onClick={() => setOpen(false)}>
        <DrawerHeader>
          <DrawerTitle>Table of Contents</DrawerTitle>
        </DrawerHeader>
        <TOCEntries />
      </DrawerContent>
    </Drawer>
  );
}
