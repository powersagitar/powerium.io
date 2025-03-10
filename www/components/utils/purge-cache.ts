'use client';

import { useEffect } from 'react';

import { purgeCache } from '@/lib/notion/cache';

export default function PurgeCache() {
  useEffect(() => {
    purgeCache();
  }, []);

  return null;
}
