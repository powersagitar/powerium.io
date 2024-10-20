import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export const H1 = forwardRef<ElementRef<'h1'>, ComponentPropsWithoutRef<'h1'>>(
  (props, ref) => {
    const { children, className, ...otherProps } = props;

    return (
      <h1
        {...otherProps}
        ref={ref}
        className={cn(
          'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
          className,
        )}
      >
        {children}
      </h1>
    );
  },
);

export const H2 = forwardRef<ElementRef<'h2'>, ComponentPropsWithoutRef<'h2'>>(
  (props, ref) => {
    const { children, className, ...otherProps } = props;

    return (
      <h2
        {...otherProps}
        ref={ref}
        className={cn(
          'mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
          className,
        )}
      >
        {children}
      </h2>
    );
  },
);

export const H3 = forwardRef<ElementRef<'h3'>, ComponentPropsWithoutRef<'h3'>>(
  (props, ref) => {
    const { children, className, ...otherProps } = props;

    return (
      <h3
        {...otherProps}
        ref={ref}
        className={cn(
          'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
          className,
        )}
      >
        {children}
      </h3>
    );
  },
);

export const H4 = forwardRef<ElementRef<'h4'>, ComponentPropsWithoutRef<'h4'>>(
  (props, ref) => {
    const { children, className, ...otherProps } = props;

    return (
      <h4
        {...otherProps}
        ref={ref}
        className={cn(
          'mt-6 scroll-m-20 text-xl font-semibold tracking-tight',
          className,
        )}
      >
        {children}
      </h4>
    );
  },
);

export const P = forwardRef<ElementRef<'p'>, ComponentPropsWithoutRef<'p'>>(
  (props, ref) => {
    const { children, className, ...otherProps } = props;

    return (
      <p
        {...otherProps}
        ref={ref}
        className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      >
        {children}
      </p>
    );
  },
);
