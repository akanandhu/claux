import { ChevronRight } from "lucide-react";

import type { ClauseInspectionBarView } from "../WorkspaceShell/types";

export function ClauseInspectionBarBreadcrumb({
  clauseLabel,
  onShowSection,
  onShowSummary,
  sectionLabel,
  view,
}: {
  clauseLabel?: string;
  onShowSection: () => void;
  onShowSummary: () => void;
  sectionLabel?: string;
  view: ClauseInspectionBarView;
}) {
  return (
    <nav
      aria-label="Clause inspection navigation"
      className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground"
    >
      <button
        className="shrink-0 font-medium uppercase tracking-[0.18em] transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
        onClick={onShowSummary}
        type="button"
      >
        Contract
      </button>
      {view !== "summary" && sectionLabel ? (
        <>
          <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
          <button
            className="min-w-0 truncate font-medium transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
            onClick={onShowSection}
            type="button"
          >
            {sectionLabel}
          </button>
        </>
      ) : null}
      {view === "clause" && clauseLabel ? (
        <>
          <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
          <span className="min-w-0 truncate text-foreground">{clauseLabel}</span>
        </>
      ) : null}
    </nav>
  );
}
