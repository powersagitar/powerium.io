import { cn } from "@/lib/utils";
import NextLink from "next/link";
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

export function H2({ className, children }: TypographyProps) {
  return (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ className, children }: TypographyProps) {
  return (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function P({ className, children }: TypographyProps) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
}

export function Ul({ className, children }: TypographyProps) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
      {children}
    </ul>
  );
}

export function Code({ className, children }: TypographyProps) {
  return (
    <code
      className={cn(
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono font-semibold",
        className
      )}
    >
      {children}
    </code>
  );
}

type LinkProps = TypographyProps & {
  href: string;
};

export function Link({ className, children, href }: LinkProps) {
  return (
    <NextLink
      href={href}
      className={cn(
        "hover:text-muted-foreground underline underline-offset-4",
        className
      )}
    >
      {children}
    </NextLink>
  );
}
