import { cn } from "@/lib/utils";
import { ComponentPropsWithRef } from "react";

export default function Iframe({
  className,
  ...props
}: ComponentPropsWithRef<"iframe">) {
  return (
    <iframe
      className={cn("w-full rounded [&:not(:first-child)]:mt-6", className)}
      loading="lazy"
      {...props}
    />
  );
}
