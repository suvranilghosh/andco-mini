"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatusCell } from "@/components/status-cell";
import { FilterBar } from "@/components/filter-bar";
import { RequestDrawer } from "@/components/request-drawer";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { fmt, getDueDays, pageStr } from "@/lib/utils";
import type { Request, CaseData } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  police: "Police",
  medical: "Medical Records",
  insurance: "Insurance",
};

const CATEGORIES = ["police", "medical", "insurance"] as const;

const TABLE_COLS = [
  "",
  "Document",
  "Source",
  "Status",
  "Assignee",
  "Requested",
  "Due In",
  "Pages",
  "Action / Reason",
  "Notes",
];

const COL_WIDTHS: Record<string, string> = {
  "": "w-8 pl-3",
  Document: "w-[200px]",
  Source: "w-36",
  Status: "w-[108px]",
  Assignee: "w-[108px]",
  Requested: "w-[90px]",
  "Due In": "w-[90px]",
  Pages: "w-[60px]",
  "Action / Reason": "w-[200px]",
  Notes: "pl-3 pr-4",
};

export function CaseRequests({ caseData }: { caseData: CaseData }) {
  const [selected, setSelected] = useState<Request | null>(null);
  const [sortKey, setSortKey] = useState<"requested_at" | "due_at">("due_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const { case: caseInfo, requests } = caseData;
  const [statuses, setStatuses] = useState<Record<string, string>>(() =>
    Object.fromEntries(requests.map((r) => [r.id, r.status])),
  );
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(requests.map((r) => [r.id, ""])),
  );

  const allStatuses = [...new Set(requests.map((r) => r.status))];
  const allAssignees = [...new Set(requests.map((r) => r.assignee))];

  function sortReqs(reqs: readonly Request[]): Request[] {
    return [...reqs].sort((a, b) => {
      const sentinel = sortDir === "asc" ? "9999-12-31" : "0000-01-01";
      const aVal = a[sortKey] ?? sentinel;
      const bVal = b[sortKey] ?? sentinel;
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }

  function handleSort(key: "requested_at" | "due_at") {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const groups = CATEGORIES.filter((cat) =>
    requests.some((r) => r.category === cat),
  ).map((cat) => ({
    cat,
    reqs: requests.filter((r) => {
      if (r.category !== cat) return false;
      if (
        filterStatus !== "all" &&
        (statuses[r.id] ?? r.status) !== filterStatus
      )
        return false;
      if (filterAssignee !== "all" && r.assignee !== filterAssignee)
        return false;
      return true;
    }),
  }));

  return (
    <>
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 border-b border-header/20 bg-header text-header-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {caseInfo.matter_name}
              </div>
              <div className="truncate text-[11px] opacity-60">
                {caseInfo.client_name} · {caseInfo.matter_type} · Incident{" "}
                {fmt(caseInfo.date_of_incident)}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right text-xs sm:block">
              <div className="opacity-70">{caseInfo.assigned_paralegal}</div>
              <div className="opacity-40">Opened {fmt(caseInfo.opened_at)}</div>
            </div>
            <ThemeToggle className="hover:bg-white/15 hover:text-white" />
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto max-w-7xl space-y-5 px-5 py-5">
        {/* Reports header with filters */}
        <FilterBar
          filterStatus={filterStatus}
          filterAssignee={filterAssignee}
          statuses={allStatuses}
          assignees={allAssignees}
          onFilterStatusChange={setFilterStatus}
          onFilterAssigneeChange={setFilterAssignee}
        />

        {groups.map(({ cat, reqs }) => {
          const sortedReqs = sortReqs(reqs);
          return (
            <section key={cat}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {CATEGORY_LABELS[cat]}
                </span>
                <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                  {reqs.length}
                </Badge>
              </div>
              <Card className="py-0">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table className="table-fixed">
                      <TableHeader>
                        <TableRow className="bg-muted/60 hover:bg-muted/60">
                          {TABLE_COLS.map((h, i) => {
                            const key =
                              h === "Requested"
                                ? "requested_at"
                                : h === "Due In"
                                  ? "due_at"
                                  : null;
                            const isActive = key !== null && sortKey === key;
                            const wCls = COL_WIDTHS[h] ?? "";
                            if (!key) {
                              return (
                                <TableHead
                                  key={i}
                                  className={`text-[10px] font-semibold uppercase tracking-wider ${wCls}`}
                                >
                                  {h}
                                </TableHead>
                              );
                            }
                            return (
                              <TableHead
                                key={h}
                                className={`text-[10px] font-semibold uppercase tracking-wider ${wCls}`}
                              >
                                <button
                                  onClick={() => handleSort(key)}
                                  className="flex items-center gap-0.5 uppercase transition-colors hover:text-foreground"
                                >
                                  {h}
                                  {isActive ? (
                                    sortDir === "asc" ? (
                                      <CaretUpIcon size={10} weight="bold" />
                                    ) : (
                                      <CaretDownIcon size={10} weight="bold" />
                                    )
                                  ) : (
                                    <CaretUpDownIcon
                                      size={10}
                                      className="opacity-40"
                                    />
                                  )}
                                </button>
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedReqs.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={TABLE_COLS.length}
                              className="h-20 text-center text-sm text-muted-foreground"
                            >
                              No reports
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedReqs.map((req) => {
                            const requestedAt = fmt(req.requested_at);
                            const due = getDueDays(
                              req,
                              statuses[req.id] ?? req.status,
                            );
                            const pages = pageStr(req);
                            const pagesPartial =
                              req.pages_received != null &&
                              req.pages_expected != null &&
                              req.pages_received < req.pages_expected;
                            return (
                              <TableRow
                                key={req.id}
                                className="cursor-pointer"
                                onClick={() => setSelected(req)}
                              >
                                <TableCell className="pl-3">
                                  {req.action_required && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <WarningIcon
                                          size={14}
                                          weight="fill"
                                          className="text-amber-500"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {req.action_required}
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="truncate">
                                    {cat === "medical"
                                      ? req.document_type.replace(
                                          "Medical Records — ",
                                          "",
                                        )
                                      : req.document_type}
                                  </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="truncate">
                                        {req.source}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {req.source}
                                    </TooltipContent>
                                  </Tooltip>
                                </TableCell>
                                <TableCell>
                                  <StatusCell
                                    status={statuses[req.id] ?? req.status}
                                    onStatusChange={(val) =>
                                      setStatuses((prev) => ({
                                        ...prev,
                                        [req.id]: val,
                                      }))
                                    }
                                  />
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-muted-foreground">
                                  {req.assignee}
                                </TableCell>
                                <TableCell
                                  className={`whitespace-nowrap tabular-nums ${
                                    requestedAt === "-"
                                      ? "text-center text-muted-foreground/40"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {requestedAt}
                                </TableCell>
                                <TableCell
                                  className={`whitespace-nowrap tabular-nums ${due.cls}`}
                                >
                                  {due.label}
                                </TableCell>
                                <TableCell
                                  className={`tabular-nums ${
                                    pages === "-"
                                      ? "text-center text-muted-foreground/40"
                                      : pagesPartial
                                        ? "text-yellow-500 dark:text-orange-400"
                                        : "text-muted-foreground"
                                  }`}
                                >
                                  {pages}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {(req.action_required ?? req.reason) && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="truncate">
                                          {req.action_required ?? req.reason}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {req.action_required ?? req.reason}
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </TableCell>
                                <TableCell className="pr-4">
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <Input
                                      value={notes[req.id] ?? ""}
                                      onChange={(e) =>
                                        setNotes((prev) => ({
                                          ...prev,
                                          [req.id]: e.target.value,
                                        }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                          e.currentTarget.blur();
                                      }}
                                      placeholder="Add note…"
                                      className="h-7 rounded-sm border-transparent bg-transparent! px-2 text-xs shadow-none hover:border-input focus-visible:border-input focus-visible:ring-0"
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </section>
          );
        })}
      </main>

      {/* ── Detail Drawer ── */}
      <RequestDrawer
        selected={selected}
        onClose={() => setSelected(null)}
        statuses={statuses}
        onStatusChange={(id, val) =>
          setStatuses((prev) => ({ ...prev, [id]: val }))
        }
        notes={notes}
        onNoteChange={(id, val) => setNotes((prev) => ({ ...prev, [id]: val }))}
      />
    </>
  );
}
