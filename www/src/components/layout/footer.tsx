import { siteConfig } from "@/lib/config/config";
import { P } from "../ui/typography";

export default function Footer() {
  return (
    <footer className="mb-4">
      <P>Copyright &copy; 2025 {siteConfig.author}. Some rights reserved.</P>
    </footer>
  );
}
