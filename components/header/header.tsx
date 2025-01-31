import 'server-only';

import { siteConfig } from '@/config/site';

import CommandBar from './command-bar';
import Desktop from './desktop';
import GithubButton from './github-button';
import Mobile from './mobile';
import ThemeToggle from './theme-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-12 items-center justify-between backdrop-blur-sm">
      <Desktop />
      <Mobile />

      <CommandBar />
      <ThemeToggle />
      {siteConfig.githubRepository && <GithubButton />}
    </header>
  );
}
