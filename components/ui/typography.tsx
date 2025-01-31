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
        className={cn('leading-7 not-first:mt-6', className)}
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
      className={cn('text-muted-foreground text-sm', className)}
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
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono font-semibold whitespace-nowrap',
        className,
      )}
    >
      {children}
    </code>
  );
});

Code.displayName = 'Code';

export const Ul = forwardRef<
  ComponentRef<'ul'>,
  ComponentPropsWithoutRef<'ul'>
>((props, ref) => {
  const { children, className, ...otherProps } = props;

  return (
    <ul
      {...otherProps}
      ref={ref}
      className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
    >
      {children}
    </ul>
  );
});

Ul.displayName = 'Ul';

export const Large = forwardRef<
  ComponentRef<'div'>,
  ComponentPropsWithoutRef<'div'>
>((props, ref) => {
  const { children, className, ...otherProps } = props;

  return (
    <div
      {...otherProps}
      ref={ref}
      className={cn('text-lg font-semibold', className)}
    >
      {children}
    </div>
  );
});

Large.displayName = 'Large';

export const Table = forwardRef<
  ComponentRef<'table'>,
  ComponentPropsWithoutRef<'table'>
>((props, ref) => {
  const { children, className, ...otherProps } = props;

  return (
    <div className={cn('my-6 w-full overflow-y-auto', className)}>
      <table className="w-full" ref={ref} {...otherProps}>
        {children}
      </table>
    </div>
  );
});

Table.displayName = 'Table';

export const Tr = forwardRef<
  ComponentRef<'tr'>,
  ComponentPropsWithoutRef<'tr'>
>((props, ref) => {
  const { children, className, ...otherProps } = props;

  return (
    <tr
      className={cn('even:bg-muted m-0 border-t p-0', className)}
      ref={ref}
      {...otherProps}
    >
      {children}
    </tr>
  );
});

Tr.displayName = 'Tr';

export const Th = forwardRef<
  ComponentRef<'th'>,
  ComponentPropsWithoutRef<'th'>
>((props, ref) => {
  const { children, className, ...otherProps } = props;

  return (
    <th
      className={cn(
        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      ref={ref}
      {...otherProps}
    >
      {children}
    </th>
  );
});

Th.displayName = 'Th';

export const Td = forwardRef<
  ComponentRef<'td'>,
  ComponentPropsWithoutRef<'td'>
>((props, ref) => {
  const { children, className, ...otherProps } = props;

  return (
    <td
      className={cn(
        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      ref={ref}
      {...otherProps}
    >
      {children}
    </td>
  );
});

Td.displayName = 'Td';
