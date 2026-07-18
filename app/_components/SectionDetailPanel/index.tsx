import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import type { ContractSection } from "@/features/demo/fixture/outline";
import { riskBadgeTone } from "../ClauseInspectionBar/utils";

export function SectionDetailPanel({
  onSelectClause,
  onViewFlow,
  section,
}: {
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onViewFlow: (sectionId: string) => void;
  section: ContractSection;
}) {
  return (
    <section className="rounded-md border border-border bg-background/55 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Section detail
          </p>
          <h2 className="mt-3 text-base font-semibold">{section.label}</h2>
        </div>
        <Badge tone={riskBadgeTone(section.risk)}>{section.risk} risk</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {section.plainEnglishSummary}
      </p>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Hazards
      </p>
      <ul className="mt-3 space-y-2">
        {section.hazards.map((hazard) => (
          <li className="flex gap-2 text-sm leading-6" key={hazard}>
            <AlertTriangle
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-warning"
            />
            <span className="text-muted-foreground">{hazard}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-md border border-border bg-surface/80 p-3">
        <p className="text-sm font-medium">Should you sign?</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {section.signGuidance}
        </p>
      </div>
      <Button className="mt-5 w-full" onClick={() => onViewFlow(section.id)}>
        View Flow
      </Button>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Clauses
      </p>
      <div className="mt-3 grid gap-2">
        {section.children.map((clause) => (
          <button
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface/70 px-3 py-2 text-left transition hover:border-primary/45 hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
            key={clause.id}
            onClick={() => onSelectClause(clause.id, section.id)}
            type="button"
          >
            <span className="truncate text-sm">{clause.label}</span>
            <Badge className="shrink-0" tone={riskBadgeTone(clause.risk)}>
              {clause.risk}
            </Badge>
          </button>
        ))}
      </div>
    </section>
  );
}
