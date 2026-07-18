import type { DemoAnalysisFixture } from "@/features/demo/types";

export type GraphPanelProps = {
  graph: DemoAnalysisFixture["graph"];
  onSelectInspector: (inspectorId: string) => void;
  selectedInspector: DemoAnalysisFixture["inspectors"][number];
  selectedNodeId: string;
};
