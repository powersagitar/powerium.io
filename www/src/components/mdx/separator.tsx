import { ReactNode } from "react";
import { Separator as UISeparator } from "../ui/separator";

type SeparatorProps = {
  children: ReactNode;
};

export default function Separator({ children }: SeparatorProps) {
  return <UISeparator className="[&:not(:first-child)]:mt-6" />;
}
