import clsx from 'clsx';

import { notionConfig } from '@/config/notion';

import { Button } from '../ui/button';
import { Link } from '../ui/link';
import GithubButton from './github-button';

type AuxiliaryPagesProps = {
  className?: string;
};

export default function AuxiliaryPages({ className }: AuxiliaryPagesProps) {
  return (
    <nav className={clsx('text-muted-foreground flex items-center', className)}>
      <Button variant="ghost" asChild>
        <Link href="/" className="no-underline">
          Home
        </Link>
      </Button>
      {notionConfig.auxiliaryPages?.about && (
        <Button variant="ghost" asChild>
          <Link href="/about" className="no-underline">
            About
          </Link>
        </Button>
      )}
      {notionConfig.auxiliaryPages?.contact && (
        <Button variant="ghost" asChild>
          <Link href="/contact" className="no-underline">
            Contact
          </Link>
        </Button>
      )}
      <Button variant="ghost" asChild>
        <Link href="/sitemap.xml" className="no-underline">
          Site Map
        </Link>
      </Button>
      <GithubButton />
    </nav>
  );
}
