'use client';

import { useTheme } from 'next-themes';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="block dark:hidden" />
          <MoonIcon className="hidden dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
