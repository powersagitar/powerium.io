import { cn } from "@/lib/utils";
import NextLink from "next/link";
import { ComponentPropsWithRef } from "react";

export function Link({
  className,
  ...props
}: ComponentPropsWithRef<typeof NextLink>) {
  return (
    <NextLink
      className={cn(
        "hover:text-muted-foreground underline underline-offset-4",
        className
      )}
      {...props}
    />
  );
}
