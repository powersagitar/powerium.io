import { siteConfig } from "@/lib/config/config";
import { Separator } from "../ui/separator";
import { P } from "../ui/typography";

export default function Footer() {
  return (
    <footer className="text-muted-foreground mb-3">
      <Separator />
      <P className="[&:not(:first-child)]:mt-3">
        Copyright &copy; 2025 {siteConfig.author}. Some rights reserved.
      </P>
    </footer>
  );
}
