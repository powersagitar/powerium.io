import { cn } from "@/lib/utils";
import NextLink from "next/link";
import { TypographyProps } from "./typography";

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
