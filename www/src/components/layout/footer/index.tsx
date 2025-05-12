import { Separator } from "@/components/ui/separator";
import AuxiliaryPages from "./auxiliary-pages";
import Copyright from "./copyright";

export default function Footer() {
  return (
    <footer className="text-muted-foreground mt-22 mb-3">
      <Separator className="my-3" />
      <AuxiliaryPages />
      <Separator className="my-3" />
      <Copyright />
    </footer>
  );
}
