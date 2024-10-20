import NextLink from 'next/link';
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export const Link = forwardRef<
  ElementRef<typeof NextLink>,
  ComponentPropsWithRef<typeof NextLink>
>((props, ref) => {
  const { children, className, ...otherProps } = props;

  return (
    <NextLink
      {...otherProps}
      ref={ref}
      className={cn(
        'underline hover:text-blue-600 dark:hover:text-blue-500',
        className,
      )}
    >
      {children}
    </NextLink>
  );
});
