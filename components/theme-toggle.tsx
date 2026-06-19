"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

function subscribe() {
  return () => {};
}

export function ThemeToggle({ className }: { className?: string }) {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();

  if (!isClient) return <div className="size-7" />;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={
        resolvedTheme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={className}
    >
      {resolvedTheme === "dark" ? (
        <MoonIcon size={14} />
      ) : (
        <SunIcon size={14} />
      )}
    </Button>
  );
}
