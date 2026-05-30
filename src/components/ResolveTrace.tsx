'use client';

import { usePathname } from 'next/navigation';

export function ResolveTrace() {
  const pathname = usePathname();
  const clean = pathname.replace(/^\//, '');

  const steps = [
    { probe: `content/${clean}.mdx`, note: 'not found' },
    { probe: `content/${clean}/index.mdx`, note: 'not found' },
    { probe: `content/${clean}/`, note: 'not a directory' },
  ];

  return (
    <div className="bg-card mb-6.5 overflow-hidden rounded-lg border">
      <div className="bg-muted flex items-center gap-2 border-b px-4 py-2.5">
        <span className="text-muted-foreground font-mono text-[11px] font-medium tracking-wide uppercase">
          console
        </span>
        <span className="text-muted-foreground/50 font-sans">·</span>
        <span className="text-muted-foreground font-mono text-[11.5px]">
          resolving <span className="text-foreground">{pathname}</span>
        </span>
      </div>
      <div className="p-4 font-mono text-[12.5px] leading-[1.9]">
        {steps.map((s, i) => (
          <div
            key={i}
            className="thin-scroll flex items-baseline gap-2.5 overflow-x-auto whitespace-nowrap"
          >
            <span className="text-muted-foreground shrink-0 font-sans select-none">
              →
            </span>
            <span className="text-foreground">{s.probe}</span>
            <span className="flex-1" />
            <span className="text-destructive flex shrink-0 items-center gap-1.5">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              {s.note}
            </span>
          </div>
        ))}
        <div className="mt-2 flex items-center gap-2.5 border-t pt-2.5">
          <span className="text-muted-foreground font-sans select-none">↳</span>
          <span className="text-foreground font-semibold">no .mdx source</span>
          <span className="text-muted-foreground font-sans">·</span>
          <span className="text-destructive">HTTP 404</span>
        </div>
      </div>
    </div>
  );
}
