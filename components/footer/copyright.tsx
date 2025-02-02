import clsx from 'clsx';

import { siteConfig } from '@/config/site';

import { Link } from '../ui/link';
import { Muted } from '../ui/typography';
import { CCBYSA } from './creative-commons-logo';

type CopyrightProps = {
  className?: string;
};

export default function Copyright({ className }: CopyrightProps) {
  return (
    <div
      className={clsx(
        'text-muted-foreground flex items-center justify-center sm:justify-between',
        className,
      )}
    >
      <div>
        <Muted className="flex flex-col justify-center sm:flex-row sm:justify-start sm:text-left">
          <span className="inline-block">
            Copyright &copy; {new Date().getUTCFullYear()}{' '}
            {siteConfig.metadata.author.name}.&nbsp;
          </span>
          <span className="inline-block">Some rights reserved.</span>
        </Muted>
        <Muted className="mt-1 flex justify-center sm:justify-start">
          Contents distributed under CC BY-SA 4.0.
        </Muted>
      </div>
      <Link
        href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.en"
        className="hidden sm:block"
      >
        <CCBYSA className="h-8 justify-end" />
      </Link>
    </div>
  );
}
