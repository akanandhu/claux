import type { DemoAnalysisFixture } from "@/features/demo/types";

export type ClauseVisualiserProps = {
  activeClauseId: string | null;
  activeSectionId: string | null;
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onSelectInspector: (inspectorId: string) => void;
  onSelectSection: (sectionId: string) => void;
  selectedInspector: DemoAnalysisFixture["inspectors"][number];
};
