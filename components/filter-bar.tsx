"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_BADGE } from "@/lib/constants";

interface FilterBarProps {
  filterStatus: string;
  filterAssignee: string;
  statuses: string[];
  assignees: string[];
  onFilterStatusChange: (value: string) => void;
  onFilterAssigneeChange: (value: string) => void;
}

export function FilterBar({
  filterStatus,
  filterAssignee,
  statuses,
  assignees,
  onFilterStatusChange,
  onFilterAssigneeChange,
}: FilterBarProps) {
  const isCleared = filterStatus === "all" && filterAssignee === "all";

  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-sm font-semibold">Reports</h2>
      <div className="flex items-center gap-2">
        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger size="sm" className="w-36">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => {
              const b = STATUS_BADGE[s] ?? {
                label: s,
                cls: "bg-zinc-100 text-zinc-500 border-zinc-200",
              };
              return (
                <SelectItem key={s} value={s}>
                  <Badge variant="outline" className={b.cls}>
                    {b.label}
                  </Badge>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Select value={filterAssignee} onValueChange={onFilterAssigneeChange}>
          <SelectTrigger size="sm" className="w-36">
            <SelectValue placeholder="All assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          disabled={isCleared}
          className="text-xs text-muted-foreground"
          onClick={() => {
            onFilterStatusChange("all");
            onFilterAssigneeChange("all");
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
