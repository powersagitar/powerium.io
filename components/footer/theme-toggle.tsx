'use client';

import clsx from 'clsx';
import { useTheme } from 'next-themes';

import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { Button } from '../ui/button';

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={clsx('outline-border rounded-md outline', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('system')}
        className={clsx(
          theme !== 'system' && 'text-muted-foreground cursor-pointer',
        )}
        suppressHydrationWarning
      >
        <DesktopIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('light')}
        className={clsx(
          theme !== 'light' && 'text-muted-foreground cursor-pointer',
        )}
        suppressHydrationWarning
      >
        <SunIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('dark')}
        className={clsx(
          theme !== 'dark' && 'text-muted-foreground cursor-pointer',
        )}
        suppressHydrationWarning
      >
        <MoonIcon />
      </Button>
    </div>
  );
}
