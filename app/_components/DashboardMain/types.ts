import type { DemoAnalysisFixture } from "@/features/demo/types";

export type DashboardMainProps = {
  analysis: DemoAnalysisFixture;
  onSelectInspector: (inspectorId: string) => void;
  selectedNodeId: string;
};
