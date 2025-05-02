import { cn } from "@/lib/utils";
import { ComponentPropsWithRef } from "react";

export function H1({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"h1">) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"h2">) {
  return (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"h3">) {
  return (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function P({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"p">) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Ul({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"ul">) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props}>
      {children}
    </ul>
  );
}

export function Code({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"code">) {
  return (
    <code
      className={cn(
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
