import 'server-only';

import { siteConfig } from '@/site.config';

import { Button } from '../ui/button';
import { Link } from '../ui/link';
import CommandBar from './command-bar';
import CustomLinkEntries from './custom-link-entries';
import ThemeToggle from './theme-toggle';

export default function Desktop() {
  return (
    <div className="justify-between items-center w-full hidden md:flex">
      <div className="mr-4 flex items-center">
        <Button variant="ghost" asChild>
          <Link
            href="/"
            className="no-underline mr-4 flex items-center space-x-2 lg:mr-6"
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
    </div>
  );
}
