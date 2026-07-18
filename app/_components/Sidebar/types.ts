import type { DemoAnalysisFixture } from "@/features/demo/types";
import type { ContractSection } from "@/features/demo/fixture/outline";

export type SidebarProps = {
  activeClauseId: string | null;
  activeSectionId: string | null;
  analysis: DemoAnalysisFixture;
  contractFileName: string;
  onClearWorkspace: () => void;
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onSelectSection: (sectionId: string) => void;
  outline: ContractSection[];
  reviewerRoleLabel: string;
};
