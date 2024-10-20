import 'server-only';

import { siteConfig } from '@/site.config';

import { Button } from '../ui/button';
import { Link } from '../ui/link';
import CommandBar from './command-bar';
import CustomLinkEntries from './custom-link-entries';
import ThemeToggle from './theme-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-10 lg:px-0 w-full backdrop-blur flex h-12 items-center justify-between">
      <div className="lg:mr-10 flex">
        <Button variant="ghost" asChild>
          <Link
            href="/"
            className="no-underline flex items-center space-x-2 lg:mr-4"
          >
            <span className="font-bold inline-block">
              {siteConfig.metadata.title}
            </span>
          </Link>
        </Button>
        <CustomLinkEntries />
      </div>

      <div className="flex items-center">
        <CommandBar />
        <ThemeToggle />
      </div>
    </header>
  );
}
