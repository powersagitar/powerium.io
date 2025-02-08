import 'server-only';

import { GitHubLogoIcon } from '@radix-ui/react-icons';

import { siteConfig } from '@/config/site';

import { Button } from '../ui/button';
import { Link } from '../ui/link';

type GithubButtonProps = {
  className?: string;
};

export default function GithubButton({ className }: GithubButtonProps) {
  return (
    <Button
      variant="ghost"
      className={className}
      aria-label="Go to website repository on GitHub."
      asChild
    >
      <Link
        href={
          'https://github.com/' +
          (siteConfig.githubRepository ?? 'powersagitar/powerium.io')
        }
      >
        <GitHubLogoIcon />
      </Link>
    </Button>
  );
}
