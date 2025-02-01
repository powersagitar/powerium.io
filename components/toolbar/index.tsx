import TOCMobile from '../table-of-contents/mobile';
import HomeButton from './home-button';
import SearchMobile from './search-mobile';
import ThemeToggle from './theme-toggle';

export default function Toolbar() {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-20 m-4 flex items-center justify-around rounded-lg backdrop-blur-sm sm:hidden">
      <HomeButton />
      <ThemeToggle />
      <SearchMobile />
      <TOCMobile />
    </div>
  );
}
