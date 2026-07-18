import type { ContractSection } from "../contractOutline";

export type ClauseVisualiserProps = {
  activeClauseId: string | null;
  activeSectionId: string | null;
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onSelectSection: (sectionId: string) => void;
  outline: ContractSection[];
};
