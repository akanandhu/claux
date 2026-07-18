import { Badge } from "@/components/Badge";
import { ClauseVisualiser } from "../ClauseVisualiser";
import { metricTone } from "../constants";
import type { DashboardMainProps } from "./types";
import DashboardMetrics from "../DashboardMetrics";
import { DemoMetric } from "../DashboardMetrics/types";

const dashboardMetrics: DemoMetric[] = [
  {
    detail: "Good",
    id: "contract-health",
    label: "Contract Health",
    question: "Is this contract well-structured?",
    tone: "success",
    value: "86 / 100",
    tip: "Contract Health evaluates the document's overall quality by checking for drafting issues, broken references, missing definitions, and structural inconsistencies before you inspect individual clauses.",
  },
  {
    detail: "5 clauses need review",
    id: "commercial-risk",
    label: "Commercial Risk",
    question: "Should I be worried?",
    tone: "danger",
    value: "High",
    tip: "Commercial Risk highlights clauses that may create financial, operational, or business exposure based on your role in the agreement. It points you to the areas worth reviewing first.",
  },
  {
    detail: "142 clauses / 87 cross references",
    id: "contract-complexity",
    label: "Contract Complexity",
    question: "How difficult is this contract to understand?",
    tone: "warning",
    value: "Medium",
    tip: "Complexity measures how challenging the agreement is to review by considering its size, cross-references, dependencies, and overall structural depth.",
  },
  {
    detail: "311 verified excerpts",
    id: "explainability",
    label: "Explainability",
    question: "Can I trust what Claux is telling me?",
    tone: "accent",
    value: "94%",
    tip: "Explainability shows how much of Claux's analysis is directly supported by evidence from the contract, so you can verify every important insight instead of relying on AI alone.",
  },
] as const;

export function DashboardMain({
  activeClauseId,
  activeSectionId,
  onSelectClause,
  onSelectInspector,
  onSelectSection,
  selectedInspector,
}: DashboardMainProps) {
  return (
    <div className="flex-1 space-y-4 p-4 lg:p-5">
      <DashboardMetrics
        dashboardMetrics={dashboardMetrics}
        metricTone={metricTone}
      />
      <ClauseVisualiser
        activeClauseId={activeClauseId}
        activeSectionId={activeSectionId}
        onSelectClause={onSelectClause}
        onSelectInspector={onSelectInspector}
        onSelectSection={onSelectSection}
        selectedInspector={selectedInspector}
      />
      <PlainEnglishExplanation inspector={selectedInspector} />
    </div>
  );
}

function PlainEnglishExplanation({
  inspector,
}: {
  inspector: DashboardMainProps["selectedInspector"];
}) {
  return (
    <section className="rounded-md border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <Badge tone="primary">Plain English explanation</Badge>
        <span className="font-mono text-xs text-muted-foreground">
          {inspector.clauseRef}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {inspector.summary}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {inspector.commercialImpact}
      </p>
    </section>
  );
}
