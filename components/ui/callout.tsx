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
        'text-blue-700 dark:text-blue-400': color === 'blue',
        'text-green-700 dark:text-green-400': color === 'green',
        'text-violet-700 dark:text-violet-400': color === 'violet',
        'text-yellow-700 dark:text-yellow-400': color === 'yellow',
        'text-red-700 dark:text-red-400': color === 'red',
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
        'border-blue-700 dark:border-blue-400': borderColor === 'blue',
        'border-green-700 dark:border-green-400': borderColor === 'green',
        'border-violet-700 dark:border-violet-400': borderColor === 'violet',
        'border-yellow-700 dark:border-yellow-400': borderColor === 'yellow',
        'border-red-700 dark:border-red-400': borderColor === 'red',
        'border-inherit': borderColor === 'inherit',
      })}
    >
      {children}
    </div>
  );
}
