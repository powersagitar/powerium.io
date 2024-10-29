import NextLink from 'next/link';
import { ComponentPropsWithRef, ComponentRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export const Link = forwardRef<
  ComponentRef<typeof NextLink>,
  ComponentPropsWithRef<typeof NextLink>
>((props, ref) => {
  const { children, className, ...otherProps } = props;

  return (
    <NextLink
      {...otherProps}
      ref={ref}
      className={cn(
        'underline transition hover:text-muted-foreground',
        className,
      )}
    >
      {children}
    </NextLink>
  );
});

Link.displayName = 'Link';
