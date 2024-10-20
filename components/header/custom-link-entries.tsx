import 'server-only';

import { siteConfig } from '@/site.config';

import { Button } from '../ui/button';
import { Link } from '../ui/link';

export default function CustomLinkEntries() {
  if (!siteConfig.customPages) {
    return null;
  }

  return (
    <nav className="hidden lg:flex items-center gap-2 text-sm lg:gap-4">
      <ul>
        {Array.from(siteConfig.customPages).map(
          ([href, { navTitle: name }]) => (
            <li className="ml-6 inline" key={href}>
              <Button variant="ghost" asChild>
                <Link href={href} className="no-underline">
                  {name}
                </Link>
              </Button>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
