import type { DemoGraphEdge, DemoGraphNode } from "@/features/demo/types";

export type StaticContractGraphProps = {
  graph: {
    nodes: DemoGraphNode[];
    edges: DemoGraphEdge[];
  };
  onSelectInspector: (inspectorId: string) => void;
  selectedNodeId: string;
};
