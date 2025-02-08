import { cn } from '@/lib/utils';

type ScrollAreaWithShadowProps = {
  className?: string;
  children: Readonly<React.ReactNode>;
};

export function VerticalScrollAreaWithShadow({
  className,
  children,
}: ScrollAreaWithShadowProps) {
  return (
    <div className="before:from-background after:from-background relative before:absolute before:top-0 before:right-0 before:left-0 before:z-10 before:h-6 before:bg-gradient-to-b after:absolute after:right-0 after:bottom-0 after:left-0 after:z-10 after:h-6 after:bg-gradient-to-t">
      <div className={cn('overflow-y-scroll py-6', className)}>{children}</div>
    </div>
  );
}
