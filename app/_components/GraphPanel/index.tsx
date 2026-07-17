import { GitBranch } from "lucide-react";

import { PanelHeader } from "../PanelHeader";
import { StaticContractGraph } from "../StaticContractGraph";
import type { GraphPanelProps } from "./types";

export function GraphPanel({
  graph,
  onSelectInspector,
  selectedNodeId,
}: GraphPanelProps) {
  return (
    <section className="rounded-md border border-border bg-surface" id="overview">
      <PanelHeader
        action={`${graph.nodes.length} nodes`}
        eyebrow="Graph"
        icon={GitBranch}
        title="Contract structure"
      />
      <StaticContractGraph
        graph={graph}
        onSelectInspector={onSelectInspector}
        selectedNodeId={selectedNodeId}
      />
    </section>
  );
}
