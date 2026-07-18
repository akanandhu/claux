import type { DemoAnalysisFixture } from "@/features/demo/types";

export type DashboardMainProps = {
  activeClauseId: string | null;
  activeSectionId: string | null;
  analysis: DemoAnalysisFixture;
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onSelectSection: (sectionId: string) => void;
  selectedInspector: DemoAnalysisFixture["inspectors"][number];
  selectedNodeId: string;
};
