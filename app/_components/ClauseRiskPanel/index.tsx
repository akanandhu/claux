import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/Badge";
import type { findContractClause } from "@/features/demo/utils";
import { clauseHazards, clauseWhyItMatters } from "../ClauseInspectionBar/utils";

export function ClauseRiskPanel({
  clause,
  sectionLabel,
}: {
  clause: NonNullable<ReturnType<typeof findContractClause>>["clause"];
  sectionLabel: string;
}) {
  const hazards = clauseHazards(clause);

  return (
    <section className="rounded-md border border-border bg-background/55 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Clause detail
      </p>
      <h2 className="mt-3 text-base font-semibold">{clause.label}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{sectionLabel}</p>
      <Badge className="mt-4" tone={clause.risk === "High" ? "danger" : "warning"}>
        {clause.risk} risk
      </Badge>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        In simple terms
      </p>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {clause.summary}
      </p>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Why this matters
      </p>
      <ul className="mt-3 space-y-2">
        {clauseWhyItMatters(clause).map((item) => (
          <li className="flex gap-2 text-sm leading-6" key={item}>
            <AlertTriangle
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-warning"
            />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Hazards
      </p>
      <ul className="mt-3 space-y-2">
        {hazards.map((hazard) => (
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
        <p className="text-sm font-medium text-success">Your role</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Read this clause against your role in the deal and check whether the
          connected section gives the other party extra leverage.
        </p>
      </div>
      <div className="mt-5 rounded-md border border-border bg-surface/80 p-3">
        <p className="text-sm font-medium">Should you sign?</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {clause.risk === "High"
            ? "Do not sign until this clause is reviewed and the practical downside is acceptable."
            : "This may be signable if the wording matches the commercial deal and does not conflict with nearby clauses."}
        </p>
      </div>
    </section>
  );
}
