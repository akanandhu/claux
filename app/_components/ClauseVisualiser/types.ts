import type { ContractSection } from "@/features/demo/fixture/outline";

export type FlowTone = "neutral" | "success" | "warning" | "danger" | "accent";

export type FlowNodeData = {
  clauses: string;
  label: string;
  risk: string;
  tone: FlowTone;
};

export type ClauseVisualiserProps = {
  activeClauseId: string | null;
  activeSectionId: string | null;
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onSelectSection: (sectionId: string) => void;
  outline: ContractSection[];
};
