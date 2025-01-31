'use client';

import { useCallback, useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';

import { useToast } from '@/hooks/use-toast';

import { Button } from '../ui/button';

export default function SearchBar() {
  const [platform, setPlatform] = useState<
    'macos' | 'windows' | 'linux' | 'unix' | 'unknown'
  >('macos');

  useEffect(() => {
    const userAgent = window.navigator.userAgent;

    if (userAgent.includes('Mac')) {
      setPlatform('macos');
    } else if (userAgent.includes('Win')) {
      setPlatform('windows');
    } else if (userAgent.includes('Linux')) {
      setPlatform('linux');
    } else if (userAgent.includes('X11')) {
      setPlatform('unix');
    } else {
      setPlatform('unknown');
    }
  }, []);

  const { toast } = useToast();

  const search = useCallback(() => {
    toast({
      description: 'Available soon!',
    });
  }, [toast]);

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      const modifierKeyDown = platform === 'macos' ? e.metaKey : e.ctrlKey;

      if (modifierKeyDown && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        search();
      }
    };

    document.addEventListener('keydown', keydownHandler);

    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, [platform, search]);

  return (
    <Button
      variant="ghost"
      className="text-muted-foreground border-muted relative flex h-8 w-full justify-start rounded-[0.5rem] border text-sm font-normal shadow-none sm:pr-12 md:w-40 lg:w-64"
      onClick={() => search()}
    >
      <span>Search...</span>
      {isDesktop && (
        <kbd className="bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium opacity-100 select-none md:flex">
          <span className="text-xs">{platform === 'macos' ? '⌘' : 'Ctrl'}</span>
          K
        </kbd>
      )}
    </Button>
  );
}
