import type { ClauseInspector } from "../ClauseInspector";
import type { DemoAnalysisFixture } from "@/features/demo/types";
import type { ContractSection } from "@/features/demo/fixture/outline";
import type {
  findContractClause,
  findContractSection,
} from "@/features/demo/utils";
import type { ClauseInspectionBarView } from "../WorkspaceShell/types";

export type ClauseInspectionBarProps = {
  activeInspectorTab: Parameters<typeof ClauseInspector>[0]["activeTab"];
  canGoBack: boolean;
  clauseSelection: ReturnType<typeof findContractClause>;
  contractSummary: DemoAnalysisFixture["executiveSummary"];
  contractType: string;
  inspectorOpen: boolean;
  isOpen: boolean;
  onBack: () => void;
  onPreviewSection: (sectionId: string) => void;
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onShowSummary: () => void;
  onViewSectionFlow: (sectionId: string) => void;
  outline: ContractSection[];
  selectedInspector: Parameters<typeof ClauseInspector>[0]["inspector"];
  selectedSection: ReturnType<typeof findContractSection>;
  setActiveInspectorTab: Parameters<typeof ClauseInspector>[0]["onTabChange"];
  setInspectorOpen: (open: boolean) => void;
  setIsOpen: (open: boolean) => void;
  topFindings: DemoAnalysisFixture["topFindings"];
  view: ClauseInspectionBarView;
};
