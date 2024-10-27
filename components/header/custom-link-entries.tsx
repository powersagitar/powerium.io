import 'server-only';

import { siteConfig } from '@/site.config';

import { Button } from '../ui/button';
import { Link } from '../ui/link';

export default function CustomLinkEntries() {
  if (!siteConfig.customPages) {
    return null;
  }

  return (
    <nav className="hidden md:flex items-center text-sm">
      <ul>
        {Array.from(siteConfig.customPages).map(
          ([href, { navTitle: name }]) => (
            <li className="ml-6 inline text-muted-foreground" key={href}>
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
