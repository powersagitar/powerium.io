import GitHubIcon from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuxiliaryPages() {
  return (
    <nav className="flex items-center">
      <Button variant="ghost" asChild>
        <Link href="/">Home</Link>
      </Button>

      <Button variant="ghost" asChild>
        <Link href="/about">About</Link>
      </Button>

      <Button variant="ghost" asChild>
        <Link href="/contact">Contact</Link>
      </Button>

      <Button variant="ghost" asChild>
        <Link href="/sitemap.xml" prefetch={false}>
          Site Map
        </Link>
      </Button>

      <Button variant="ghost" size="icon" asChild>
        <Link href="https://github.com/powersagitar/powerium.io">
          <GitHubIcon />
        </Link>
      </Button>
    </nav>
  );
}
