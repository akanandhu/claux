import type { DemoGraphNode } from "@/features/demo/types";

export type GraphNodeProps = {
  isConnected: boolean;
  isSelected: boolean;
  node: DemoGraphNode;
  onSelectInspector: (inspectorId: string) => void;
};
