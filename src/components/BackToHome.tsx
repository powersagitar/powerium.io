'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

export function BackToHome() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <div className="mb-8">
      <Button variant="ghost" size="sm" asChild className="-ml-3">
        <Link href="/">← Home</Link>
      </Button>
    </div>
  );
}
