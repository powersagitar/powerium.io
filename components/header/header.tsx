import 'server-only';

import { siteConfig } from '@/site.config';

import { Link } from '../ui/CommonElements';
import CommandBar from './command-bar';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-10 lg:px-0 w-full backdrop-blur flex h-14 items-center justify-center md:justify-between">
      <div className="lg:mr-4 flex">
        <Link href="/" className="flex items-center space-x-2 lg:mr-6">
          <span className="font-bold inline-block">
            {siteConfig.metadata.title}
          </span>
        </Link>
        <CustomLinkEntries />
      </div>

      <CommandBar />
    </header>
  );
}

function CustomLinkEntries() {
  if (!siteConfig.customPages) {
    return null;
  }

  return (
    <nav className="hidden lg:flex items-center gap-4 text-sm lg:gap-6">
      <ul>
        {Array.from(siteConfig.customPages).map(
          ([href, { navTitle: name }]) => (
            <li className="ml-10 inline" key={href}>
              <Link href={href}>{name}</Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
