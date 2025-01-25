import 'server-only';

import { siteConfig } from '@/config/site';

import CommandBar from './command-bar';
import Desktop from './desktop';
import GithubButton from './github-button';
import Mobile from './mobile';
import ThemeToggle from './theme-toggle';

export default function Header() {
  return (
    <header className="backdrop-blur-sm sticky flex items-center justify-between top-0 h-12 z-50">
      <Desktop />
      <Mobile />

      <CommandBar />
      <ThemeToggle />
      {siteConfig.githubRepository && <GithubButton />}
    </header>
  );
}
