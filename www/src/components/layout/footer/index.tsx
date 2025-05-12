import { Separator } from "@/components/ui/separator";
import AuxiliaryPages from "./auxiliary-pages";
import Copyright from "./copyright";
import { ThemeToggle } from "./theme-toggle";

export default function Footer() {
  return (
    <footer className="text-muted-foreground mt-22 mb-3">
      <Separator className="my-3" />

      <div className="flex items-center justify-between">
        <AuxiliaryPages />
        <ThemeToggle />
      </div>

      <Separator className="my-3" />

      <Copyright />
    </footer>
  );
}
