import clsx from 'clsx';
import { ReactNode } from 'react';

export function CalloutBadge({
  children,
  color,
}: {
  children: Readonly<ReactNode>;
  color: 'blue' | 'green' | 'violet' | 'yellow' | 'red' | 'inherit';
}) {
  return (
    <span
      className={clsx('flex items-center', {
        'text-blue-600 dark:text-blue-500': color === 'blue',
        'text-green-600 dark:text-green-500': color === 'green',
        'text-violet-600 dark:text-violet-500': color === 'violet',
        'text-yellow-600 dark:text-yellow-500': color === 'yellow',
        'text-red-600 dark:text-red-500': color === 'red',
        'text-inherit': color === 'inherit',
      })}
    >
      {children}
    </span>
  );
}

export function Callout({
  borderColor,
  children,
}: {
  borderColor: 'blue' | 'green' | 'violet' | 'yellow' | 'red' | 'inherit';
  children: Readonly<ReactNode>;
}) {
  return (
    <div
      className={clsx('mt-6 border-l-2 pl-6', {
        'border-blue-600 dark:border-blue-500': borderColor === 'blue',
        'border-green-600 dark:border-green-500': borderColor === 'green',
        'border-violet-600 dark:border-violet-500': borderColor === 'violet',
        'border-yellow-600 dark:border-yellow-500': borderColor === 'yellow',
        'border-red-600 dark:border-red-500': borderColor === 'red',
        'border-inherit': borderColor === 'inherit',
      })}
    >
      {children}
    </div>
  );
}
