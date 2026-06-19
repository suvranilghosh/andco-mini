"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { STATUS_BADGE } from "@/lib/constants";

interface StatusCellProps {
  status: string;
  onStatusChange: (newStatus: string) => void;
}

export function StatusCell({ status, onStatusChange }: StatusCellProps) {
  const badge = STATUS_BADGE[status] ?? {
    label: status,
    cls: "bg-zinc-100 text-zinc-500 border-zinc-200",
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger
        className="h-auto! w-auto! gap-0! border-0! bg-transparent! p-0! shadow-none! focus-visible:ring-0! *:aria-[hidden]:hidden cursor-pointer"
      >
        <Badge variant="outline" className={badge.cls}>
          {badge.label}
        </Badge>
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {Object.entries(STATUS_BADGE).map(([val, { label, cls }]) => (
          <SelectItem key={val} value={val}>
            <Badge variant="outline" className={cls}>
              {label}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </div>
  );
}
