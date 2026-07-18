import { Badge } from "@/components/Badge";
import { findContractClause, findContractSection } from "@/features/demo/utils";
import type { DashboardMainProps } from "../DashboardMain/types";

export function PlainEnglishExplanation({
  inspector,
  selectedClause,
  selectedSection,
}: {
  inspector: DashboardMainProps["selectedInspector"];
  selectedClause: ReturnType<typeof findContractClause>;
  selectedSection: ReturnType<typeof findContractSection>;
}) {
  const title =
    selectedClause?.clause.label ??
    selectedSection?.label ??
    inspector.clauseRef;
  const summary =
    selectedClause?.clause.summary ??
    selectedSection?.plainEnglishSummary ??
    inspector.summary;
  const impact =
    selectedClause
      ? `${selectedClause.clause.risk} priority: review this clause together with ${selectedClause.section.label}.`
      : selectedSection?.signGuidance ?? inspector.commercialImpact;

  return (
    <section className="rounded-md border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <Badge tone="primary">Plain English explanation</Badge>
        <span className="font-mono text-xs text-muted-foreground">
          {title}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {summary}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {impact}
      </p>
    </section>
  );
}
