'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BackToHome() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <div className="mb-8">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        ← Home
      </Link>
    </div>
  );
}
