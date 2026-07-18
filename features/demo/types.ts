export type FindingSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type PresentationLabel =
  | "FACT"
  | "STRUCTURAL_DIAGNOSTIC"
  | "CONTRACT_SMELL"
  | "COMMERCIAL_RISK"
  | "LEGAL_REVIEW_SIGNAL"
  | "NEGOTIATION_SUGGESTION"
  | "UNCERTAIN";

export type GraphNodeType =
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

export type GraphEdgeType =
  | "CONTAINS"
  | "REFERENCES"
  | "MENTIONS_PARTY"
  | "ASSIGNED_TO"
  | "GRANTS_RIGHT_TO"
  | "DEPENDS_ON"
  | "TRIGGERED_BY"
  | "HAS_DEADLINE"
  | "HAS_CONSEQUENCE"
  | "SUPPORTED_BY"
  | "AFFECTS";

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

export type DemoGraphNode = {
  id: string;
  label: string;
  type: GraphNodeType;
  x: number;
  y: number;
  size: number;
  inspectorId?: string;
};

export type DemoGraphEdge = {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  confidence: number;
  pathType: "dependency" | "reference" | "risk";
  dashed?: boolean;
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
  nodeType: GraphNodeType;
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
};

export type DemoAnalysisFixture = {
  contract: {
    fileName: string;
    contractType: string;
    reviewingRole: string;
    effectiveDate: string;
    pageCount: number;
    clauseCount: number;
    analysisCompletedAt: string;
  };
  navItems: DemoNavItem[];
  metrics: DemoMetric[];
  graph: {
    nodes: DemoGraphNode[];
    edges: DemoGraphEdge[];
  };
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
