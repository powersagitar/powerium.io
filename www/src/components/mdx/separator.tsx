import { cn } from "@/lib/utils";
import { ComponentPropsWithRef } from "react";
import { Separator as UISeparator } from "../ui/separator";

export default function Separator({
  className,
  ...props
}: ComponentPropsWithRef<typeof UISeparator>) {
  return (
    <UISeparator
      className={cn("[&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  );
}
