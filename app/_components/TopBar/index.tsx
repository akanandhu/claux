import { Search, UserRound } from "lucide-react";

import { Badge } from "@/components/Badge";
import type { TopBarProps } from "./types";

export function TopBar({ contract }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-2 backdrop-blur lg:px-5">
      <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <Badge tone={contract.requiresPartyClarification ? "warning" : "primary"}>
            {contract.requiresPartyClarification
              ? "Needs confirmation"
              : "Inferred party"}
          </Badge>
          <p className="flex min-w-0 items-center gap-1.5">
            <UserRound aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">
              Reviewing for {contract.reviewingRole}
              {typeof contract.reviewerConfidence === "number"
                ? ` (${Math.round(contract.reviewerConfidence * 100)}%)`
                : null}
            </span>
          </p>
          {contract.counterpartyGlance?.length ? (
            <details className="relative">
              <summary className="cursor-pointer rounded-sm text-foreground transition hover:text-primary focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary">
                Other parties
              </summary>
              <div className="absolute left-0 top-6 z-30 w-72 rounded-md border border-border bg-surface p-3 shadow-xl shadow-black/20">
                {contract.counterpartyGlance.map((party) => (
                  <article className="py-2 first:pt-0 last:pb-0" key={party.partyName}>
                    <p className="font-medium text-foreground">
                      {party.partyName} ({Math.round(party.confidence * 100)}%)
                    </p>
                    <p className="mt-1 leading-5 text-muted-foreground">
                      {party.summary}
                    </p>
                  </article>
                ))}
              </div>
            </details>
          ) : null}
        </div>
        {/* <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <label className="relative min-w-0 sm:w-72">
            <span className="sr-only">Search clauses, risks, evidence</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              className="h-8 w-full rounded-md border border-border bg-surface py-1.5 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25"
              placeholder="Search clauses, risks, evidence"
              type="search"
            />
          </label>
        </div> */}
      </div>
    </header>
  );
}
