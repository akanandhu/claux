import { Clock3, FileText, RefreshCw } from "lucide-react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { formatDateTime } from "../format";
import type { SidebarProps } from "./types";

export function Sidebar({ analysis }: SidebarProps) {
  return (
    <aside className="border-b border-border bg-surface/85 px-4 py-4 xl:border-b-0 xl:border-r xl:px-5 xl:py-6">
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
        <Button
          className="text-xs text-foreground hover:text-white xl:mt-6 xl:w-full"
          icon={RefreshCw}
        >
          Replace document
        </Button>
      </div>

      <div className="mt-5 rounded-md border border-border bg-background/55 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Primary contract
        </p>
        <h2 className="mt-2 text-sm font-medium leading-5">
          {analysis.contract.fileName}
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <Meta label="Type" value={analysis.contract.contractType} />
          <Meta label="Role" value={analysis.contract.reviewingRole} />
          <Meta label="Pages" value={analysis.contract.pageCount} />
          <Meta label="Clauses" value={analysis.contract.clauseCount} />
        </dl>
      </div>

      <nav aria-label="Workspace navigation" className="mt-5">
        <ul className="grid gap-1 sm:grid-cols-2 xl:grid-cols-1">
          {analysis.navItems.map((item) => (
            <li key={item.id}>
              <a
                className="flex h-10 items-center justify-between rounded-md px-3 text-sm text-muted-foreground transition hover:bg-surface-raised hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                href={`#${item.id}`}
              >
                <span>{item.label}</span>
                <Badge>{item.count}</Badge>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-5 rounded-md border border-border bg-background/55 p-4 text-xs text-muted-foreground xl:mt-auto">
        <div className="flex items-center gap-2 text-foreground">
          <Clock3 aria-hidden="true" className="size-4 text-primary" />
          Analysis metadata
        </div>
        <p className="mt-2">
          Completed {formatDateTime(analysis.contract.analysisCompletedAt)}
        </p>
        <p className="mt-1">Static reviewed fixture, browser-local demo.</p>
      </footer>
    </aside>
  );
}

function Meta({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}
