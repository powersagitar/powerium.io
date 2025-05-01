import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type TypographyProps = {
  className?: string;
  children: ReactNode;
};

export function H1({ className, children }: TypographyProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  );
}
