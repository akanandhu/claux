import { useMemo } from "react";

import { edgeColor } from "../constants";
import { GraphMarkers } from "../GraphMarkers";
import { GraphNode } from "../GraphNode";
import { GraphToolbar } from "../GraphToolbar";
import type { StaticContractGraphProps } from "./types";

export function StaticContractGraph({
  graph,
  onSelectInspector,
  selectedNodeId,
}: StaticContractGraphProps) {
  const graphIndex = useMemo(() => {
    const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
    const selectedEdgeIds = new Set<string>();
    const selectedNodeIds = new Set([selectedNodeId]);

    graph.edges.forEach((edge) => {
      if (edge.source === selectedNodeId || edge.target === selectedNodeId) {
        selectedEdgeIds.add(edge.id);
        selectedNodeIds.add(edge.source);
        selectedNodeIds.add(edge.target);
      }
    });

    return { nodesById, selectedEdgeIds, selectedNodeIds };
  }, [graph.edges, graph.nodes, selectedNodeId]);

  return (
    <div className="border-t border-border">
      <GraphToolbar />
      <div className="overflow-hidden p-3 sm:p-4">
        <svg
          aria-label="Static contract structure graph"
          className="min-h-[360px] w-full rounded-md border border-border bg-background"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          viewBox="0 0 790 310"
        >
          <GraphMarkers />
          <g>
            {graph.edges.map((edge) => {
              const source = graphIndex.nodesById.get(edge.source);
              const target = graphIndex.nodesById.get(edge.target);
              if (!source || !target) return null;

              const isSelected = graphIndex.selectedEdgeIds.has(edge.id);
              return (
                <line
                  key={edge.id}
                  markerEnd={`url(#arrow-${edge.pathType})`}
                  stroke={edgeColor(edge.pathType)}
                  strokeDasharray={edge.dashed ? "7 7" : undefined}
                  strokeLinecap="round"
                  strokeOpacity={isSelected ? 0.95 : 0.28}
                  strokeWidth={isSelected ? 3 : 1.7}
                  x1={source.x}
                  x2={target.x}
                  y1={source.y}
                  y2={target.y}
                />
              );
            })}
          </g>
          <g>
            {graph.nodes.map((node) => (
              <GraphNode
                isConnected={graphIndex.selectedNodeIds.has(node.id)}
                isSelected={node.id === selectedNodeId}
                key={node.id}
                node={node}
                onSelectInspector={onSelectInspector}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
