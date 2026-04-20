import type { ReactNode } from 'react';

import {
  CircleAlert,
  Info,
  Lightbulb,
  MessageSquareWarning,
  TriangleAlert,
} from 'lucide-react';

type CalloutType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

type Props = {
  type?: CalloutType;
  children?: ReactNode;
};

const config: Record<
  CalloutType,
  {
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    borderClass: string;
    accentClass: string;
  }
> = {
  note: {
    label: 'Note',
    Icon: Info,
    borderClass: 'border-blue-500',
    accentClass: 'text-blue-600 dark:text-blue-400',
  },
  tip: {
    label: 'Tip',
    Icon: Lightbulb,
    borderClass: 'border-green-500',
    accentClass: 'text-green-600 dark:text-green-400',
  },
  important: {
    label: 'Important',
    Icon: MessageSquareWarning,
    borderClass: 'border-purple-500',
    accentClass: 'text-purple-600 dark:text-purple-400',
  },
  warning: {
    label: 'Warning',
    Icon: TriangleAlert,
    borderClass: 'border-amber-500',
    accentClass: 'text-amber-600 dark:text-amber-400',
  },
  caution: {
    label: 'Caution',
    Icon: CircleAlert,
    borderClass: 'border-red-500',
    accentClass: 'text-red-600 dark:text-red-400',
  },
};

export function Callout({ type = 'note', children }: Props) {
  const { label, Icon, borderClass, accentClass } = config[type] ?? config.note;

  return (
    <div className={`not-prose my-4 border-l-4 pl-4 ${borderClass}`}>
      <div
        className={`mb-1 flex items-center gap-1.5 text-sm font-semibold ${accentClass}`}
      >
        <Icon className="size-4" />
        {label}
      </div>
      <div className="prose text-sm [&>p:last-child]:mb-0">{children}</div>
    </div>
  );
}
