'use client';

import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { Button } from '../ui/button';

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const { theme, setTheme } = useTheme();

  return (
    <div className={clsx('outline-border rounded-md outline', className)}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Use system theme"
        onClick={() => setTheme('system')}
        className={clsx(
          'cursor-pointer',
          isClient && theme !== 'system' && 'text-muted-foreground',
        )}
      >
        <DesktopIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Use light theme"
        onClick={() => setTheme('light')}
        className={clsx(
          'cursor-pointer',
          isClient && theme !== 'light' && 'text-muted-foreground',
        )}
      >
        <SunIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Use dark theme"
        onClick={() => setTheme('dark')}
        className={clsx(
          'cursor-pointer',
          isClient && theme !== 'dark' && 'text-muted-foreground',
        )}
      >
        <MoonIcon />
      </Button>
    </div>
  );
}
