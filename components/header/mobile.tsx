'use client';

import { useEffect, useState } from 'react';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import fetchCustomPages from '@/lib/fetch-custom-pages';

import { Button } from '../ui/button';
import { Link } from '../ui/link';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Large, Ul } from '../ui/typography';

export default function Mobile() {
  const [open, setOpen] = useState(false);
  const [customPages, setCustomPages] = useState([]);

  useEffect(() => {
    fetchCustomPages().then((customPagesT) => {
      setCustomPages(Object.values(customPagesT));
    });
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTitle>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="px-3 mx-1 flex md:hidden"
            onClick={(e) => {
              e.preventDefault();
              alert('Coming soon!');
            }}
          >
            <HamburgerMenuIcon />
          </Button>
        </SheetTrigger>
      </SheetTitle>
      <SheetContent side="left" className="pr-0">
        <Link href="/" className="no-underline w-full">
          <Large>home</Large>
        </Link>
        <ScrollArea>
          <Ul className="list-none">
            {customPages.map(({ href, title }) => (
              <li key={href}>
                <Link href={href} className="no-underline w-full">
                  {title}
                </Link>
              </li>
            ))}
          </Ul>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
