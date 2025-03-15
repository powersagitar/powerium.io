import clsx from 'clsx';

import { Separator } from '../ui/separator';
import AuxiliaryPages from './auxiliary-pages';
import Copyright from './copyright';
import ThemeToggle from './theme-toggle';
import WebRing from './webring';

type FooterProps = {
  className?: string;
};

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={clsx('to-secondary bg-gradient-to-b', className)}>
      <div className="w-full lg:w-2/3">
        <Separator className="my-3" />
        <div className="flex justify-center sm:justify-between">
          <AuxiliaryPages className="max-w-full overflow-x-scroll" />
          <ThemeToggle className="mr-4 hidden sm:flex" />
        </div>
        <Separator className="my-3" />
        <WebRing className="sm:px-4" />
        <Separator className="my-3" />
        <Copyright className="px-4" />
      </div>
    </footer>
  );
}
