import clsx from 'clsx';
import { ReactNode } from 'react';

import { ChevronUpIcon } from '@heroicons/react/24/outline';

export function Li({
  children,
  styles,
}: {
  children: ReactNode;
  styles?: { p?: 'p-8' };
}) {
  return (
    <li className={clsx('leading-7 not-first:mt-6', styles?.p)}>{children}</li>
  );
}

export function Iframe({
  src,
  width,
  height,
}: {
  src: string;
  width?: string;
  height?: string;
}) {
  return (
    <iframe
      src={src}
      title={'Generic HTML iframe tag'}
      width={width ?? '100%'}
      height={height ?? '500rem'}
      loading="lazy"
      className="rounded"
    />
  );
}

export function Pre({ children }: { children: ReactNode }) {
  return <pre className="not-first:mt-6">{children}</pre>;
}

export function Figcaption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="my-2">
      <ChevronUpIcon className="inline h-[1em] w-[1em]" /> {children}
    </figcaption>
  );
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}
