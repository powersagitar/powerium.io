import 'server-only';

import { siteConfig } from '@/config/site';

import { Button } from '../ui/button';
import { Link } from '../ui/link';
import CustomLinkEntries from './custom-link-entries';

export default function Desktop() {
  return (
    <div className="hidden w-full items-center justify-between md:flex">
      <div className="mr-4 flex items-center">
        <Button variant="ghost" asChild>
          <Link
            href="/"
            className="mr-4 flex items-center space-x-2 no-underline lg:mr-6"
          >
            <span className="inline-block font-bold">
              {siteConfig.metadata.title}
            </span>
          </Link>
        </Button>
        <CustomLinkEntries />
      </div>
    </div>
  );
}
