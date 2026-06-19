"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { XIcon } from "@phosphor-icons/react";
import { StatusCell } from "@/components/status-cell";
import { NOTE_STYLE } from "@/lib/constants";
import { fmt, getDueDays, pageStr } from "@/lib/utils";
import type { Request } from "@/lib/types";

interface RequestDrawerProps {
  selected: Request | null;
  onClose: () => void;
  statuses: Record<string, string>;
  onStatusChange: (id: string, val: string) => void;
  notes: Record<string, string>;
  onNoteChange: (id: string, val: string) => void;
}

export function RequestDrawer({
  selected,
  onClose,
  statuses,
  onStatusChange,
  notes,
  onNoteChange,
}: RequestDrawerProps) {
  const note = selected
    ? (selected.action_required ?? selected.reason ?? null)
    : null;

  return (
    <Drawer
      open={selected !== null}
      onOpenChange={(open) => { if (!open) onClose(); }}
      direction="right"
    >
      <DrawerContent>
        {selected && (
          <div className="flex h-full flex-col overflow-hidden">
            {/* Header */}
            <DrawerHeader className="border-b">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <DrawerTitle className="truncate">
                    {selected.document_type}
                  </DrawerTitle>
                  <DrawerDescription className="truncate">
                    {selected.source}
                  </DrawerDescription>
                </div>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon-xs" className="shrink-0">
                    <XIcon />
                  </Button>
                </DrawerClose>
              </div>
              <div className="mt-2">
                <StatusCell
                  status={statuses[selected.id] ?? selected.status}
                  onStatusChange={(val) => onStatusChange(selected.id, val)}
                />
              </div>
            </DrawerHeader>

            {/* Body */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {/* Metadata */}
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                {(
                  [
                    ["Assignee", selected.assignee],
                    ["Requested", fmt(selected.requested_at)],
                    (() => {
                      const d = getDueDays(
                        selected,
                        statuses[selected.id] ?? selected.status,
                      );
                      return ["Due In", d.label, d.cls];
                    })(),
                    ["Updated", fmt(selected.updated_at)],
                    ...(selected.pages_received != null
                      ? [
                          [
                            "Pages",
                            pageStr(selected),
                            selected.pages_expected != null &&
                            selected.pages_received < selected.pages_expected
                              ? "text-red-600 dark:text-red-400"
                              : undefined,
                          ],
                        ]
                      : []),
                  ] as [string, string, string?][]
                ).map(([label, value, cls]) => (
                  <React.Fragment key={label}>
                    <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      {label}
                    </dt>
                    <dd className={`text-xs tabular-nums ${cls ?? ""}`}>
                      {value}
                    </dd>
                  </React.Fragment>
                ))}
              </dl>

              {/* Action note */}
              {note && (
                <div
                  className={`px-3 py-2.5 text-xs leading-snug ${
                    NOTE_STYLE[selected.status] ??
                    "border-l-[3px] border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {note}
                </div>
              )}

              {/* Notes */}
              <Separator />
              <div>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Notes
                </h3>
                <Textarea
                  value={notes[selected.id] ?? ""}
                  onChange={(e) => onNoteChange(selected.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                  placeholder="Add a note…"
                  className="min-h-[80px] resize-none text-xs"
                />
              </div>

              {/* Activity */}
              {selected.activity && selected.activity.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Activity
                    </h3>
                    <ol className="space-y-0">
                      {selected.activity.map((act, i) => (
                        <li key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="mt-1 size-1.5 shrink-0 rounded-full bg-border" />
                            {i < selected.activity!.length - 1 && (
                              <div className="my-0.5 w-px flex-1 bg-border" />
                            )}
                          </div>
                          <div className="pb-3 last:pb-0">
                            <div className="text-[10px] tabular-nums text-muted-foreground">
                              {fmt(act.at)}
                            </div>
                            <div className="text-xs">{act.text}</div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
