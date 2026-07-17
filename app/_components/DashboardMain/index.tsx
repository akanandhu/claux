import { Badge } from "@/components/Badge";
import { GraphPanel } from "../GraphPanel";
import { MetricGrid } from "../MetricGrid";
import type { DashboardMainProps } from "./types";

export function DashboardMain({
  analysis,
  onSelectInspector,
  selectedInspector,
  selectedNodeId,
}: DashboardMainProps) {
  return (
    <div className="flex-1 space-y-4 p-4 lg:p-5">
      <MetricGrid metrics={analysis.metrics} />
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
