import { FindingsPanel } from "../FindingsPanel";
import { GraphPanel } from "../GraphPanel";
import { MetricGrid } from "../MetricGrid";
import { SummaryPanel } from "../SummaryPanel";
import type { DashboardMainProps } from "./types";

export function DashboardMain({
  analysis,
  onSelectInspector,
  selectedNodeId,
}: DashboardMainProps) {
  return (
    <div className="flex-1 space-y-5 p-4 lg:p-6">
      <MetricGrid metrics={analysis.metrics} />
      <GraphPanel
        graph={analysis.graph}
        onSelectInspector={onSelectInspector}
        selectedNodeId={selectedNodeId}
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <SummaryPanel items={analysis.executiveSummary} />
        <FindingsPanel findings={analysis.topFindings} />
      </div>
    </div>
  );
}
