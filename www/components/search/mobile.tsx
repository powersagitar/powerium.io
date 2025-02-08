import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

import { siteConfig } from '@/config/site';

import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import SearchForm from './form';

export default function SearchMobile() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <MagnifyingGlassIcon />
          <span className="sr-only">Search the site</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col items-center pb-4">
        <DrawerHeader>
          <DrawerTitle>Search</DrawerTitle>
          <DrawerDescription>
            Search for anything on {siteConfig.metadata.title} with Google.
          </DrawerDescription>
        </DrawerHeader>
        <div className="w-4/5">
          <SearchForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
