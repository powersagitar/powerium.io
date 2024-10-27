import 'server-only';

import Desktop from './desktop';
import Mobile from './mobile';

export default function Header() {
  return (
    <header className="backdrop-blur sticky flex items-center top-0 h-12 z-50 px-10 lg:px-0">
      <Desktop />
      <Mobile />
    </header>
  );
}
