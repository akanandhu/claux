import type { DemoAnalysisFixture } from "@/features/demo/types";

export type SidebarProps = {
  activeClauseId: string | null;
  activeSectionId: string | null;
  analysis: DemoAnalysisFixture;
  contractFileName: string;
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onSelectSection: (sectionId: string) => void;
  reviewerRoleLabel: string;
};
