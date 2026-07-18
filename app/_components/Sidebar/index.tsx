"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  ChevronRight,
  FileText,
  FileUp,
  Search,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import type { SidebarProps } from "./types";

const contractOutline = [
  {
    children: ["1.1 Defined Terms", "1.2 Interpretation", "1.3 Order of Priority"],
    count: 12,
    label: "Definitions",
  },
  {
    children: ["2.1 Service Scope", "2.2 Support", "2.3 Service Levels"],
    count: 16,
    label: "Services",
  },
  {
    children: [
      "3.1 Fees",
      "3.2 Invoicing",
      "3.3 Payment Due Date",
      "3.4 Late Payment",
      "3.5 Taxes",
      "3.6 Refunds",
      "3.7 Set-off",
      "3.8 Currency",
    ],
    count: 8,
    label: "Payment Terms",
  },
  {
    children: ["4.1 Customer Materials", "4.2 Provider IP", "4.3 License Rights"],
    count: 10,
    label: "Intellectual Property",
  },
  {
    children: ["5.1 Confidential Information", "5.2 Permitted Disclosures", "5.3 Survival"],
    count: 7,
    label: "Confidentiality",
  },
  {
    children: ["6.1 Exclusions", "6.2 Liability Cap", "6.3 Indemnity"],
    count: 9,
    label: "Liability",
  },
  {
    children: ["7.1 Term", "7.2 Termination for Cause", "7.3 Effect of Termination"],
    count: 10,
    label: "Termination",
  },
  {
    children: ["8.1 Notices", "8.2 Assignment", "8.3 Governing Law"],
    count: 12,
    label: "General Provisions",
  },
];

export function Sidebar({ analysis, roleLabel }: SidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  function toggleSection(label: string) {
    setExpandedSection((current) => (current === label ? null : label));
  }

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
          <Button className="h-11 w-full" icon={FileUp} variant="primary">
            Upload contract
          </Button>
          <Button className="h-11 w-full text-center" icon={UserRound}>
            {roleLabel}
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
          {contractOutline.map((item, index) => (
            <li key={item.label}>
              <button
                aria-expanded={expandedSection === item.label}
                className={`flex h-10 w-full items-center justify-between rounded-md px-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary ${
                  item.label === "Payment Terms"
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:bg-surface-raised hover:text-foreground"
                }`}
                onClick={() => toggleSection(item.label)}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <ChevronRight
                    aria-hidden="true"
                    className={`size-3.5 shrink-0 transition ${
                      expandedSection === item.label ? "rotate-90" : ""
                    }`}
                  />
                  <BookOpenText aria-hidden="true" className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {index + 1}. {item.label}
                  </span>
                </span>
                <Badge className="shrink-0 text-[11px]">{item.count}</Badge>
              </button>
              {expandedSection === item.label ? (
                <ul className="ml-4 mt-1 space-y-1 border-l border-border/70 pl-4">
                  {item.children.map((child) => (
                    <li key={child}>
                      <a
                        className={`flex h-9 items-center justify-between rounded-md px-2 text-xs ${
                          child === "3.4 Late Payment"
                            ? "bg-primary/15 font-medium text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        href="#overview"
                      >
                        <span className="truncate">{child}</span>
                        {child === "3.4 Late Payment" ? (
                          <span
                            aria-hidden="true"
                            className="size-1.5 rounded-full bg-danger"
                          />
                        ) : null}
                      </a>
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
        <a
          className="mt-5 inline-flex items-center gap-2 font-medium text-primary hover:text-foreground"
          href="#overview"
        >
          View all insights
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </a>
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
