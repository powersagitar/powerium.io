import 'server-only';

import { siteConfig } from '@/site.config';

import SearchBar from './SearchBar';
import { Link } from './ui/CommonElements';

export function Nav() {
  return (
    <nav className="mx-14 my-3 flex items-center justify-center md:justify-between">
      <h1 className="md:mr-10 font-bold">
        <Link href="/">{siteConfig.metadata.title}</Link>
      </h1>

      <SearchBar />

      <CustomLinkEntries />
    </nav>
  );
}

function CustomLinkEntries() {
  if (!siteConfig.customPages) {
    return null;
  }

  return (
    <ul className="hidden md:block">
      {Array.from(siteConfig.customPages).map(([href, { navTitle: name }]) => (
        <li className="ml-10 inline" key={href}>
          <Link href={href}>{name}</Link>
        </li>
      ))}
    </ul>
  );
}
