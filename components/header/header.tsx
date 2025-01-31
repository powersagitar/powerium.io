import 'server-only';

import { siteConfig } from '@/config/site';

import Desktop from './desktop';
import GithubButton from './github-button';
import Mobile from './mobile';
import SearchBar from './search-bar';
import ThemeToggle from './theme-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-12 items-center justify-between backdrop-blur-sm">
      <Desktop />
      <Mobile />

      <SearchBar />
      <ThemeToggle />
      {siteConfig.githubRepository && <GithubButton />}
    </header>
  );
}
