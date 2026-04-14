import type { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export function Timeline({ children }: Props) {
  return (
    <div className="not-prose my-6">
      <ul className="border-border relative space-y-6 border-l-2 pl-2">
        {children}
      </ul>
    </div>
  );
}
