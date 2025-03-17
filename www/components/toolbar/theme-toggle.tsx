'use client';

import { useTheme } from 'next-themes';
import { useState } from 'react';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';

export default function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  return (
    <Drawer open={open} onOpenChange={setOpen} autoFocus={open}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="block dark:hidden" />
          <MoonIcon className="hidden dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="pb-4">
        <DrawerHeader>
          <DrawerTitle>Theme</DrawerTitle>
          <DrawerDescription>Let the ambience move with you.</DrawerDescription>
        </DrawerHeader>

        <div className="mx-auto flex w-4/5 flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setTheme('system');
              setOpen(false);
            }}
          >
            System
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setTheme('light');
              setOpen(false);
            }}
          >
            Light
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setTheme('dark');
              setOpen(false);
            }}
          >
            Dark
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
