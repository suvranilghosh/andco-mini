export const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  received: {
    label: "Received",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60",
  },
  in_progress: {
    label: "In Progress",
    cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60",
  },
  needs_action: {
    label: "Needs Action",
    cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/60",
  },
  requested: {
    label: "Requested",
    cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
  },
  partially_received: {
    label: "Partial",
    cls: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/60",
  },
  on_hold: {
    label: "On Hold",
    cls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800/60",
  },
  draft: {
    label: "Draft",
    cls: "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/60",
  },
  canceled: {
    label: "Canceled",
    cls: "bg-zinc-50 text-zinc-400 border-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-500 dark:border-zinc-800/60",
  },
};

export const NOTE_STYLE: Record<string, string> = {
  needs_action:
    "bg-red-50 border-l-[3px] border-red-400 text-red-800 dark:bg-red-950/20 dark:border-red-600 dark:text-red-300",
  rejected:
    "bg-red-50 border-l-[3px] border-red-400 text-red-800 dark:bg-red-950/20 dark:border-red-600 dark:text-red-300",
  on_hold:
    "bg-amber-50 border-l-[3px] border-amber-400 text-amber-800 dark:bg-amber-950/20 dark:border-amber-600 dark:text-amber-300",
};
