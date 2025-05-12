import { Muted } from "@/components/ui/typography";
import { siteConfig } from "@/lib/config/config";

export default function Copyright() {
  return (
    <Muted className="mx-4">
      Copyright &copy; 2025 {siteConfig.author}. Some rights reserved.
    </Muted>
  );
}
