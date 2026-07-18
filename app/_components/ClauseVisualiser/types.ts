import type { DemoAnalysisFixture } from "@/features/demo/types";

export type ClauseVisualiserProps = {
  onSelectInspector: (inspectorId: string) => void;
  selectedInspector: DemoAnalysisFixture["inspectors"][number];
};
