'use client';

import { useEffect, useState } from 'react';

type Props = {
  value?: number;
  start?: string;
  end?: string;
  label?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function calcTimeProgress(start: string, end: string): number {
  const now = Date.now();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (e <= s) return 100;
  return clamp(((now - s) / (e - s)) * 100, 0, 100);
}

export function ProgressBar({ value, start, end, label }: Props) {
  const isTimeBased = start !== undefined && end !== undefined;

  const [progress, setProgress] = useState<number>(() =>
    value !== undefined ? clamp(value, 0, 100) : 0,
  );

  useEffect(() => {
    if (isTimeBased) {
      setProgress(calcTimeProgress(start, end));
    }
  }, [isTimeBased, start, end]);

  const pct = Math.round(progress);

  return (
    <div className="not-prose my-4 flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        {label ? (
          <span className="text-foreground font-medium">{label}</span>
        ) : (
          <span />
        )}
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label ?? 'Progress'}
        />
      </div>
    </div>
  );
}
