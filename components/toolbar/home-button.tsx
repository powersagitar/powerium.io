import { HomeIcon } from '@radix-ui/react-icons';

import { Button } from '../ui/button';
import { Link } from '../ui/link';

export default function HomeButton() {
  return (
    <Button variant="ghost" asChild>
      <Link href="/">
        <HomeIcon />
      </Link>
    </Button>
  );
}
