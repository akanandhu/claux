import { List, Route } from "lucide-react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { StaticContractGraph } from "../StaticContractGraph";
import { severityTone } from "../constants";
import type { GraphPanelProps } from "./types";

export function GraphPanel({
  graph,
  onSelectInspector,
  selectedInspector,
  selectedNodeId,
}: GraphPanelProps) {
  return (
    <section className="rounded-md border border-border bg-surface" id="overview">
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">{selectedInspector.title}</h2>
            {selectedInspector.severity ? (
              <Badge tone={severityTone[selectedInspector.severity]}>
                {selectedInspector.severity}
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Visual map of how this clause works
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button icon={Route} size="sm">
            Flow
          </Button>
          <Button icon={List} size="sm">
            Explain
          </Button>
        </div>
      </div>
      <StaticContractGraph
        graph={graph}
        onSelectInspector={onSelectInspector}
        selectedNodeId={selectedNodeId}
      />
    </section>
  );
}
