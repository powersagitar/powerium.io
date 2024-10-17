'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { isBrowser } from 'react-device-detect';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar() {
  const [platform, setPlatform] = useState<
    'macos' | 'windows' | 'linux' | 'unix' | 'unknown'
  >('unknown');

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
  }, [platform]);

  return (
    <motion.button
      whileTap={{ opacity: 0 }}
      className="hidden md:flex h-8 grow items-center rounded-full border border-neutral-500 text-neutral-500 dark:border-neutral-400 dark:text-neutral-400"
      onClick={() => search()}
    >
      <div className="ml-7 mr-5 flex items-center">
        <MagnifyingGlassIcon className="h-5 w-5" />
        <p className="ml-3">Search</p>
      </div>

      {isBrowser && platform !== 'unknown' && (
        <div className="ml-auto mr-7">
          {platform === 'macos' ? (
            <abbr title="Command" className="no-underline">
              <kbd>&#8984;</kbd>
            </abbr>
          ) : (
            <kbd>Ctrl</kbd>
          )}
          <kbd className="ml-1">K</kbd>
        </div>
      )}
    </motion.button>
  );
}

function search() {
  alert('Available soon!');
}
