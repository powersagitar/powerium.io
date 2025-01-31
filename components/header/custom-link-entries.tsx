import 'server-only';

import { notionConfig } from '@/config/notion';

import { Button } from '../ui/button';
import { Link } from '../ui/link';

export default function CustomLinkEntries() {
  if (!notionConfig.customPages) {
    return null;
  }

  return (
    <nav className="hidden items-center text-sm md:flex">
      <ul>
        {Array.from(notionConfig.customPages).map(
          ([href, { navTitle: name }]) => (
            <li className="text-muted-foreground ml-6 inline" key={href}>
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
