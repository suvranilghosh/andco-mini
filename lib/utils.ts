import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Request } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}/${String(y).slice(2)}`;
}

export function pageStr(req: Request): string {
  if (req.pages_received == null) return "-";
  return req.pages_expected != null
    ? `${req.pages_received} of ${req.pages_expected}`
    : String(req.pages_received);
}

export function getDueDays(
  req: Request,
  effectiveStatus: string,
): { label: string; cls: string } {
  if (!req.due_at)
    return { label: "-", cls: "text-center text-muted-foreground/40" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = req.due_at.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  const days = Math.round((due.getTime() - today.getTime()) / 86400000);
  const isTerminal = ["received", "canceled", "draft"].includes(effectiveStatus);
  if (days === 0) {
    return {
      label: "Today",
      cls: isTerminal
        ? "text-muted-foreground"
        : "text-amber-600 dark:text-amber-400 font-medium",
    };
  }
  if (days > 0) return { label: `${days}d`, cls: "text-muted-foreground" };
  const abs = Math.abs(days);
  return isTerminal
    ? { label: `${abs}d ago`, cls: "text-muted-foreground/50" }
    : {
        label: `${abs}d overdue`,
        cls: "text-red-600 dark:text-red-400 font-medium",
      };
}
