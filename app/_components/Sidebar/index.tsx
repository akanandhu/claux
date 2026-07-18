import {
  BookOpenText,
  FileText,
  FileUp,
  Search,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import type { SidebarProps } from "./types";

const contractOutline = [
  { count: 12, label: "Definitions" },
  { count: 16, label: "Services" },
  {
    children: [
      "3.1 Fees",
      "3.2 Invoicing",
      "3.3 Payment Due Date",
      "3.4 Late Payment",
      "3.5 Taxes",
      "3.6 Refunds",
    ],
    count: 8,
    label: "Payment Terms",
  },
  { count: 10, label: "Intellectual Property" },
  { count: 7, label: "Confidentiality" },
  { count: 9, label: "Liability" },
  { count: 10, label: "Termination" },
  { count: 12, label: "General Provisions" },
];

export function Sidebar({ analysis, roleLabel }: SidebarProps) {
  return (
    <aside className="border-b border-border bg-surface/85 px-4 py-4 xl:sticky xl:top-0 xl:flex xl:h-screen xl:flex-col xl:overflow-y-auto xl:border-b-0 xl:border-r xl:px-5 xl:py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 xl:block">
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
      </div>

      <div className="mt-6 grid gap-3">
        <Button className="w-full text-foreground hover:text-white" icon={FileUp}>
          Upload legal clause
        </Button>
        <Button className="w-full justify-start text-left" icon={UserRound}>
          {roleLabel}
        </Button>
      </div>

      <div className="mt-6">
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
            className="h-9 w-full rounded-md border border-border bg-background/55 py-2 pl-9 pr-3 text-xs text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="Search outline..."
            type="search"
          />
        </label>
      </div>

      <nav aria-label="Contract outline" className="mt-4">
        <ul className="space-y-1">
          {contractOutline.map((item, index) => (
            <li key={item.label}>
              <a
                className={`flex h-9 items-center justify-between rounded-md px-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary ${
                  item.label === "Payment Terms"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-surface-raised hover:text-foreground"
                }`}
                href="#overview"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <BookOpenText aria-hidden="true" className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {index + 1}. {item.label}
                  </span>
                </span>
                <Badge className="shrink-0 text-[11px]">{item.count}</Badge>
              </a>
              {item.children ? (
                <ul className="mt-1 space-y-1 pl-7">
                  {item.children.map((child) => (
                    <li key={child}>
                      <a
                        className={`block truncate rounded-md px-2 py-1.5 text-xs ${
                          child === "3.4 Late Payment"
                            ? "bg-primary/15 font-medium text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        href="#overview"
                      >
                        {child}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-6 rounded-md border border-border bg-background/55 p-4 text-xs text-muted-foreground xl:mt-auto">
        <p className="font-medium text-foreground">Contract overview</p>
        <dl className="mt-4 grid grid-cols-3 gap-3">
          <OverviewMetric label="Clauses" value={analysis.contract.clauseCount} />
          <OverviewMetric
            label="Obligations"
            value={analysis.navItems.find((item) => item.id === "obligations")?.count ?? 0}
          />
          <OverviewMetric
            label="Risks"
            value={analysis.navItems.find((item) => item.id === "risks")?.count ?? 0}
          />
        </dl>
      </footer>
    </aside>
  );
}

function OverviewMetric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd className="mt-1 text-base font-semibold text-foreground">{value}</dd>
    </div>
  );
}
