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
        'hover:text-muted-foreground font-medium [overflow-wrap:anywhere] underline underline-offset-4 transition',
        className,
      )}
    >
      {children}
    </NextLink>
  );
});

Link.displayName = 'Link';
