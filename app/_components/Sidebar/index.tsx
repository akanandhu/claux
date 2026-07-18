"use client";

import {
  BookOpenText,
  ChevronRight,
  FileText,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SidebarOverviewMetric } from "../SidebarOverviewMetric";
import type { SidebarProps } from "./types";

export function Sidebar({
  activeClauseId,
  activeSectionId,
  analysis,
  contractFileName,
  onClearWorkspace,
  onSelectClause,
  onSelectSection,
  outline,
  reviewerRoleLabel,
}: SidebarProps) {
  return (
    <aside className="flex max-h-screen flex-col border-b border-border bg-surface/85 px-4 py-4 xl:sticky xl:top-0 xl:h-screen xl:border-b-0 xl:border-r xl:px-5 xl:py-6">
      <div className="shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md border border-primary/40 bg-primary/15 text-primary">
            <FileText aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">Claux</p>
            <p className="text-xs text-muted-foreground">
              Contract intelligence
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-3">
          <div className="flex min-h-11 min-w-0 items-center gap-3 overflow-hidden rounded-md border border-primary/35 bg-primary/12 px-3 py-2 text-sm text-foreground">
            <FileText aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="max-w-full truncate font-medium" title={contractFileName}>
                {contractFileName}
              </p>
              <p className="text-xs text-muted-foreground">Uploaded contract</p>
            </div>
            <Button
              className="shrink-0"
              icon={Trash2}
              iconOnlyLabel="Remove document"
              onClick={onClearWorkspace}
              size="icon"
              variant="danger"
            />
          </div>
          <Button className="h-11 w-full justify-center text-center" icon={UserRound}>
            {reviewerRoleLabel}
          </Button>
        </div>

        <div className="mt-7">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Contract outline
          </p>
          <label className="relative mt-3 block">
            <span className="sr-only">Search outline</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              className="h-10 w-full rounded-md border border-border bg-background/55 py-2 pl-9 pr-3 text-xs text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25"
              placeholder="Search outline..."
              type="search"
            />
          </label>
        </div>
      </div>

      <nav
        aria-label="Contract outline"
        className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1"
      >
        <ul className="space-y-1 pb-4">
          {outline.map((item, index) => (
            <li key={item.label}>
              <button
                aria-expanded={activeSectionId === item.id}
                className={`flex h-10 w-full items-center justify-between rounded-md px-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary ${
                  activeSectionId === item.id
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:bg-surface-raised hover:text-foreground"
                }`}
                onClick={() => onSelectSection(item.id)}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <ChevronRight
                    aria-hidden="true"
                    className={`size-3.5 shrink-0 transition ${
                      activeSectionId === item.id ? "rotate-90" : ""
                    }`}
                  />
                  <BookOpenText aria-hidden="true" className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {index + 1}. {item.label}
                  </span>
                </span>
                <Badge className="shrink-0 text-[11px]">{item.count}</Badge>
              </button>
              {activeSectionId === item.id ? (
                <ul className="ml-4 mt-1 space-y-1 border-l border-border/70 pl-4">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <button
                        className={`flex h-9 w-full min-w-0 items-center justify-between rounded-md px-2 text-xs ${
                          activeClauseId === child.id
                            ? "bg-primary/15 font-medium text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => onSelectClause(child.id, item.id)}
                        type="button"
                      >
                        <span className="truncate">{child.label}</span>
                        {child.risk === "High" ? (
                          <span
                            aria-hidden="true"
                            className="size-1.5 rounded-full bg-danger"
                          />
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-4 shrink-0 rounded-md border border-border bg-background/55 p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Contract overview</p>
        <dl className="mt-4 grid grid-cols-3 gap-3">
          <SidebarOverviewMetric
            label="Clauses"
            value={analysis.contract.clauseCount}
          />
          <SidebarOverviewMetric
            label="Obligations"
            value={analysis.navItems.find((item) => item.id === "obligations")?.count ?? 0}
          />
          <SidebarOverviewMetric
            label="Risks"
            value={analysis.navItems.find((item) => item.id === "risks")?.count ?? 0}
          />
        </dl>
      </footer>
    </aside>
  );
}
