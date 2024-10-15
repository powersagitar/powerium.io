'use client';

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
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1 className={className ?? 'mb-4 w-full text-center text-4xl'}>
      <strong>{children}</strong>
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
    <h2 className={className ?? 'mb-7 text-3xl'} id={id}>
      <b>{children}</b>
    </h2>
  );
}

export function H3({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h3 className="mb-6 text-2xl" id={id}>
      <b>{children}</b>
    </h3>
  );
}

export function H4({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h4 className="mb-5 text-xl" id={id}>
      <b>{children}</b>
    </h4>
  );
}

export function P({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={className ?? 'mb-4 mt-2'}>{children}</p>;
}

export function Li({ children }: { children: ReactNode }) {
  return <li className="my-2 list-inside list-disc">{children}</li>;
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
  return <pre>{children}</pre>;
}

export function Figcaption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="my-2">
      <ChevronUpIcon className="h-[1em] w-[1em] inline" /> {children}
    </figcaption>
  );
}

export function Hr({ className }: { className?: string }) {
  return <hr className={className ?? 'rounded-full mb-5 w-full'} />;
}

export function Vr({
  className,
  bgcolor,
}: {
  className?: string;
  bgcolor?: string;
}) {
  return (
    <Hr
      className={
        className ??
        `w-1 rounded-full h-auto border-none ${bgcolor ?? 'bg-black dark:bg-white'}`
      }
    />
  );
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <div className="flex mb-4">
      <Vr />
      <blockquote className="mx-6">{children}</blockquote>
    </div>
  );
}
