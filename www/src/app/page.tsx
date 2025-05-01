import { H1 } from "@/components/ui/typography";
import { config } from "@/lib/config/config";

export default function Home() {
  return (
    <main>
      <H1>{config.title}</H1>
    </main>
  );
}
