import { CircleHelp } from "lucide-react";

import { Badge } from "@/components/Badge";
import { metricTone } from "../constants";
import { GraphPanel } from "../GraphPanel";
import type { DashboardMainProps } from "./types";

const dashboardMetrics = [
  {
    detail: "Good",
    id: "contract-health",
    label: "Contract Health",
    question: "Is this contract well-structured?",
    tone: "success",
    value: "86 / 100",
  },
  {
    detail: "5 clauses need review",
    id: "commercial-risk",
    label: "Commercial Risk",
    question: "Should I be worried?",
    tone: "danger",
    value: "High",
  },
  {
    detail: "142 clauses / 87 cross references",
    id: "contract-complexity",
    label: "Contract Complexity",
    question: "How difficult is this agreement?",
    tone: "warning",
    value: "Medium",
  },
  {
    detail: "311 verified excerpts",
    id: "explainability",
    label: "Explainability",
    question: "Can I trust what Claux is telling me?",
    tone: "accent",
    value: "94%",
  },
] as const;

export function DashboardMain({
  analysis,
  onSelectInspector,
  selectedInspector,
  selectedNodeId,
}: DashboardMainProps) {
  return (
    <div className="flex-1 space-y-4 p-4 lg:p-5">
      <DashboardMetrics />
      <GraphPanel
        graph={analysis.graph}
        onSelectInspector={onSelectInspector}
        selectedInspector={selectedInspector}
        selectedNodeId={selectedNodeId}
      />
      <PlainEnglishExplanation inspector={selectedInspector} />
    </div>
  );
}

function DashboardMetrics() {
  return (
    <section
      aria-label="Contract metrics"
      className="grid gap-2 md:grid-cols-2 xl:grid-cols-4"
    >
      {dashboardMetrics.map((metric) => (
        <article
          className="min-w-0 rounded-md border border-border bg-surface p-3"
          key={metric.id}
        >
          <div className="flex items-center justify-between gap-2">
            <div
              className={`inline-flex max-w-full rounded-sm border px-2 py-1 text-xs font-medium ${metricTone[metric.tone]}`}
            >
              <span className="truncate">{metric.label}</span>
            </div>
            <span
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm border border-border bg-background text-muted-foreground"
              title={metric.question}
            >
              <CircleHelp aria-hidden="true" className="size-3.5" />
              <span className="sr-only">{metric.question}</span>
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-normal">
            {metric.value}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {metric.detail}
          </p>
        </article>
      ))}
    </section>
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
