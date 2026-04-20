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
    barClass: string;
    accentClass: string;
  }
> = {
  note: {
    label: 'Note',
    Icon: Info,
    barClass: 'bg-blue-500',
    accentClass: 'text-blue-600 dark:text-blue-400',
  },
  tip: {
    label: 'Tip',
    Icon: Lightbulb,
    barClass: 'bg-green-500',
    accentClass: 'text-green-600 dark:text-green-400',
  },
  important: {
    label: 'Important',
    Icon: MessageSquareWarning,
    barClass: 'bg-purple-500',
    accentClass: 'text-purple-600 dark:text-purple-400',
  },
  warning: {
    label: 'Warning',
    Icon: TriangleAlert,
    barClass: 'bg-amber-500',
    accentClass: 'text-amber-600 dark:text-amber-400',
  },
  caution: {
    label: 'Caution',
    Icon: CircleAlert,
    barClass: 'bg-red-500',
    accentClass: 'text-red-600 dark:text-red-400',
  },
};

export function Callout({ type = 'note', children }: Props) {
  const { label, Icon, barClass, accentClass } = config[type] ?? config.note;

  return (
    <div className="not-prose relative my-4 pl-5">
      <span
        className={`absolute top-0 bottom-0 left-0 w-1 rounded-full ${barClass}`}
      />
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
