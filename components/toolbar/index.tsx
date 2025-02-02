import clsx from 'clsx';

import TOCMobile from '../table-of-contents/mobile';
import HomeButton from './home-button';
import SearchMobile from './search-mobile';
import ThemeToggle from './theme-toggle';

type ToolbarProps = {
  className?: string;
};

export default function Toolbar({ className }: ToolbarProps) {
  return (
    <aside
      className={clsx(
        'bg-muted/80 fixed right-0 bottom-0 left-0 z-20 items-center justify-around rounded-t-2xl border p-1 backdrop-blur-sm',
        className,
      )}
    >
      <HomeButton />
      <ThemeToggle />
      <SearchMobile />
      <TOCMobile />
    </aside>
  );
}
