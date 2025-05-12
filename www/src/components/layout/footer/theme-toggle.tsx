"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const { theme, setTheme } = useTheme();

  return (
    <div className="outline-border mr-4 rounded-md outline">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={clsx(
          "cursor-pointer",
          isClient && theme === "light" && "text-foreground"
        )}
      >
        <Sun />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={clsx(
          "cursor-pointer",
          isClient && theme === "system" && "text-foreground"
        )}
      >
        <Settings />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={clsx(
          "cursor-pointer",
          isClient && theme === "dark" && "text-foreground"
        )}
      >
        <Moon />
      </Button>
    </div>
  );
}
