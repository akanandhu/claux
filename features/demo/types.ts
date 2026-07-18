export type FindingSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type PresentationLabel =
  | "FACT"
  | "STRUCTURAL_DIAGNOSTIC"
  | "CONTRACT_SMELL"
  | "COMMERCIAL_RISK"
  | "LEGAL_REVIEW_SIGNAL"
  | "NEGOTIATION_SUGGESTION"
  | "UNCERTAIN";

export type DemoInspectorNodeType =
  | "CONTRACT"
  | "SECTION"
  | "CLAUSE"
  | "PARTY"
  | "DEFINED_TERM"
  | "OBLIGATION"
  | "RIGHT"
  | "PROHIBITION"
  | "CONDITION"
  | "DATE"
  | "VALUE"
  | "REFERENCE"
  | "FINDING"
  | "EVIDENCE";

export type DemoMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: "neutral" | "success" | "warning" | "danger" | "accent";
};

export type DemoNavItem = {
  id: string;
  label: string;
  count: number;
};

export type DemoEvidence = {
  id: string;
  clauseRef: string;
  page: number;
  excerpt: string;
  validationStatus: "VERIFIED" | "PARTIALLY_VERIFIED" | "NEEDS_REVIEW";
};

export type DemoDependency = {
  id: string;
  label: string;
  relationship: string;
  severity?: FindingSeverity;
};

export type DemoInspector = {
  id: string;
  nodeId: string;
  clauseRef: string;
  title: string;
  nodeType: DemoInspectorNodeType;
  severity?: FindingSeverity;
  confidence: number;
  labels: PresentationLabel[];
  summary: string;
  keyInfo: Array<{
    label: string;
    value: string;
  }>;
  dependencyChain: DemoDependency[];
  evidence: DemoEvidence[];
  commercialImpact: string;
  uncertainty: string;
  suggestedAction: string;
  history: Array<{
    label: string;
    detail: string;
  }>;
};

export type DemoFinding = {
  id: string;
  title: string;
  category: PresentationLabel;
  severity: FindingSeverity;
  summary: string;
  clauseRefs: string[];
  confidence: number;
  validationStatus: DemoEvidence["validationStatus"];
};

export type DemoAnalysisFixture = {
  contract: {
    fileName: string;
    title: string;
    contractType: string;
    reviewingRole: string;
    reviewerConfidence?: number;
    requiresPartyClarification?: boolean;
    counterpartyGlance?: Array<{
      partyName: string;
      summary: string;
      confidence: number;
    }>;
    effectiveDate: string;
    pageCount: number;
    clauseCount: number;
    analysisCompletedAt: string;
  };
  navItems: DemoNavItem[];
  metrics: DemoMetric[];
  defaultInspectorId: string;
  inspectors: DemoInspector[];
  executiveSummary: string[];
  outline?: DemoOutlineSection[];
  topFindings: DemoFinding[];
};

export type DemoOutlineClause = {
  id: string;
  label: string;
  risk: "Low" | "Medium" | "High";
  summary: string;
};

export type DemoOutlineSection = {
  children: DemoOutlineClause[];
  count: number;
  hazards: string[];
  id: string;
  label: string;
  plainEnglishSummary: string;
  risk: "Low" | "Medium" | "High";
  signGuidance: string;
};
