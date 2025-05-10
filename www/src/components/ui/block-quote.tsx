import { cn } from "@/lib/utils";
import { ComponentPropsWithRef } from "react";

export default function BlockQuote({
  className,
  ...props
}: ComponentPropsWithRef<"blockquote">) {
  return (
    <blockquote
      className={cn(
        "border-l-4 pl-6 italic [&:not(:first-child)]:mt-6",
        className
      )}
      {...props}
    />
  );
}
