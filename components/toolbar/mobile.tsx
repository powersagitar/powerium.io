import TOCMobile from '../table-of-contents/mobile';
import HomeButton from './home-button';
import SearchMobile from './search-mobile';
import ThemeToggle from './theme-toggle';

export default function Mobile() {
  return (
    <div className="bg-muted/75 fixed right-0 bottom-0 left-0 z-20 flex items-center justify-around rounded-t-2xl p-1 backdrop-blur-sm sm:hidden">
      <HomeButton />
      <ThemeToggle />
      <SearchMobile />
      <TOCMobile />
    </div>
  );
}
