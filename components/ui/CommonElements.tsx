'use client';

import clsx from 'clsx';
import { Url } from 'next/dist/shared/lib/router/router';
import NextLink from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

import {
  ArrowTopRightOnSquareIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

import * as motion from '@/lib/framer-motion';

export function Link({
  children,
  href,
  className,
  externalSymbol,
  textDecoration,
  replace,
  scroll,
  prefetch,
}: {
  children: React.ReactNode;
  href: Url;
  className?: string;
  externalSymbol?: 'always' | 'never';
  textDecoration?: 'underline';
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
}) {
  const [isExternal, setIsExternal] = useState(false);

  useEffect(() => {
    if (
      new URL(href.toString(), window.location.origin).hostname !==
      window.location.hostname
    ) {
      setIsExternal(true);
    }
  }, [href]);

  return (
    <NextLink
      href={href}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch}
      className={className}
    >
      <motion.span whileTap={{ opacity: 0 }}>
        <span className={textDecoration ?? ''}>{children}</span>

        {externalSymbol !== 'never' &&
          (externalSymbol === 'always' || isExternal) && (
            <>
              {' '}
              {/* Vertical shift of -0.15em is for visual alignment */}
              <ArrowTopRightOnSquareIcon className="inline relative top-[-0.15em] w-[1em] h-[1em]" />
            </>
          )}
      </motion.span>
    </NextLink>
  );
}

export function H1({
  children,
  styles,
}: {
  children: ReactNode;
  styles?: {
    'text-align'?: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
    mb?: 'mb-4';
  };
}) {
  return (
    <h1
      className={clsx(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        styles?.mb,
        {
          [`text-${styles?.['text-align']}`]:
            styles?.['text-align'] !== undefined,
        },
      )}
    >
      {children}
    </h1>
  );
}

export function H2({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <h2
      className={
        className ??
        'mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'
      }
      id={id}
    >
      {children}
    </h2>
  );
}

export function H3({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h3
      className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight"
      id={id}
    >
      {children}
    </h3>
  );
}

export function H4({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h4
      className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight"
      id={id}
    >
      {children}
    </h4>
  );
}

export function P({
  children,
  styles,
}: {
  children: ReactNode;
  styles?: { mt?: 'mt-1' | 'mt-2' };
}) {
  return (
    <p
      className={clsx(
        'leading-7',
        `[&:not(:first-child)]:${styles?.mt ?? 'mt-6'}`,
      )}
    >
      {children}
    </p>
  );
}

export function Li({
  children,
  styles,
}: {
  children: ReactNode;
  styles?: { p?: 'p-8' };
}) {
  return (
    <li className={clsx('leading-7 [&:not(:first-child)]:mt-6', styles?.p)}>
      {children}
    </li>
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
    />
  );
}

export function Pre({ children }: { children: ReactNode }) {
  return <pre className="[&:not(:first-child)]:mt-6">{children}</pre>;
}

export function Figcaption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="my-2">
      <ChevronUpIcon className="h-[1em] w-[1em] inline" /> {children}
    </figcaption>
  );
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}

export function Code({ children }: { children: Readonly<ReactNode> }) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold">
      {children}
    </code>
  );
}

export function Ul({
  children,
  styles,
}: {
  children: Readonly<ReactNode>;
  styles?: {
    ml?: 'ml-0';
    my?: 'my-0';
    ['list-style-type']?: 'list-none' | 'list-disc' | 'list-decimal';
  };
}) {
  return (
    <ul
      className={clsx(
        '[&>li]:mt-2',
        styles?.ml ?? 'ml-6',
        styles?.my ?? 'my-6',
        styles?.['list-style-type'] ?? 'list-disc',
      )}
    >
      {children}
    </ul>
  );
}
