import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export const H1 = forwardRef<
  ComponentRef<'h1'>,
  ComponentPropsWithoutRef<'h1'>
>((props, ref) => {
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
});

H1.displayName = 'H1';

export const H2 = forwardRef<
  ComponentRef<'h2'>,
  ComponentPropsWithoutRef<'h2'>
>((props, ref) => {
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
});

H2.displayName = 'H2';

export const H3 = forwardRef<
  ComponentRef<'h3'>,
  ComponentPropsWithoutRef<'h3'>
>((props, ref) => {
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
});

H3.displayName = 'H3';

export const H4 = forwardRef<
  ComponentRef<'h4'>,
  ComponentPropsWithoutRef<'h4'>
>((props, ref) => {
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
});

H4.displayName = 'H4';

export const P = forwardRef<ComponentRef<'p'>, ComponentPropsWithoutRef<'p'>>(
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

P.displayName = 'P';

export const Muted = forwardRef<
  ComponentRef<'p'>,
  ComponentPropsWithoutRef<'p'>
>((props, ref) => {
  const { children, className, ...otherProps } = props;

  return (
    <p
      {...otherProps}
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
    >
      {children}
    </p>
  );
});

Muted.displayName = 'Muted';

export const Code = forwardRef<
  ComponentRef<'code'>,
  ComponentPropsWithoutRef<'code'>
>((props, ref) => {
  const { children, className, ...otherProps } = props;

  return (
    <code
      {...otherProps}
      ref={ref}
      className={cn(
        'relative rounded bg-muted whitespace-nowrap px-[0.3rem] py-[0.2rem] font-mono font-semibold',
        className,
      )}
    >
      {children}
    </code>
  );
});

Code.displayName = 'Code';
