import type { DemoAnalysisFixture } from "@/features/demo/types";
import type { ContractSection } from "../contractOutline";

export type DashboardMainProps = {
  activeClauseId: string | null;
  activeSectionId: string | null;
  analysis: DemoAnalysisFixture;
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onSelectSection: (sectionId: string) => void;
  outline: ContractSection[];
  selectedInspector: DemoAnalysisFixture["inspectors"][number];
  selectedNodeId: string;
};
