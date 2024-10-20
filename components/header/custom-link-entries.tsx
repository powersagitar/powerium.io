import 'server-only';

import { siteConfig } from '@/site.config';

import { Link } from '../ui/link';

export default function CustomLinkEntries() {
  if (!siteConfig.customPages) {
    return null;
  }

  return (
    <nav className="hidden lg:flex items-center gap-4 text-sm lg:gap-6">
      <ul>
        {Array.from(siteConfig.customPages).map(
          ([href, { navTitle: name }]) => (
            <li className="ml-10 inline" key={href}>
              <Link href={href} className="no-underline">
                {name}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
