import type { ContractSection } from "@/features/demo/fixture/outline";
import type { DemoAnalysisFixture } from "@/features/demo/types";

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
  contract: DemoAnalysisFixture["contract"];
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onSelectSection: (sectionId: string) => void;
  outline: ContractSection[];
};
