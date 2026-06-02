"use client";

import { Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={toggle}
    >
      {theme === "dark"
        ? <SunMedium className="h-4 w-4" />
        : <Moon className="h-4 w-4" />}
    </Button>
  );
}
