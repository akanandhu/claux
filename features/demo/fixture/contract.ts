import type {
  DemoAnalysisFixture,
  DemoFinding,
  DemoMetric,
  DemoNavItem,
} from "../types";

export const contract: DemoAnalysisFixture["contract"] = {
  fileName: "Acme Cloud Services Agreement.pdf",
  title: "Acme Cloud Services Agreement",
  contractType: "SaaS services agreement",
  reviewingRole: "Customer",
  reviewerConfidence: 0.82,
  requiresPartyClarification: false,
  counterpartyGlance: [
    {
      partyName: "Provider",
      summary: "Counterparty glance only; full directional review is framed for Customer.",
      confidence: 0.8,
    },
  ],
  effectiveDate: "2026-07-01",
  pageCount: 18,
  clauseCount: 42,
  analysisCompletedAt: "2026-07-17T10:30:00+05:30",
};

export const navItems: DemoNavItem[] = [
  { id: "overview", label: "Overview", count: 8 },
  { id: "clauses", label: "Clauses", count: 42 },
  { id: "obligations", label: "Obligations", count: 16 },
  { id: "risks", label: "Commercial risks", count: 5 },
  { id: "smells", label: "Contract smells", count: 3 },
  { id: "evidence", label: "Evidence links", count: 31 },
];

export const metrics: DemoMetric[] = [
  {
    id: "coverage",
    label: "Evidence coverage",
    value: "86%",
    detail: "31 linked excerpts",
    tone: "success",
  },
  {
    id: "confidence",
    label: "Extraction confidence",
    value: "0.82",
    detail: "hybrid parse",
    tone: "accent",
  },
  {
    id: "dependencies",
    label: "Critical dependencies",
    value: "7",
    detail: "payment and termination paths",
    tone: "warning",
  },
  {
    id: "findings",
    label: "Open findings",
    value: "5",
    detail: "2 high commercial risks",
    tone: "danger",
  },
];

export const executiveSummary = [
  "The sample agreement has strong clause structure and most key obligations are linked to evidence.",
  "Commercial review should prioritize liability cap scope, termination dependencies, and service credit treatment.",
  "No jurisdiction-specific legal enforceability assessment is included in this visual fixture.",
];

export const topFindings: DemoFinding[] = [
  {
    id: "finding-cap",
    title: "Liability cap may absorb service credits",
    category: "COMMERCIAL_RISK",
    severity: "HIGH",
    summary: "Service credits and damages appear connected to the same recovery limit.",
    clauseRefs: ["7.4", "11.2"],
    confidence: 0.81,
    validationStatus: "VERIFIED",
  },
  {
    id: "finding-cure",
    title: "Termination path depends on separate cure language",
    category: "CONTRACT_SMELL",
    severity: "MEDIUM",
    summary: "The remedy can be traced, but the path crosses payment, notice, and breach sections.",
    clauseRefs: ["4.1", "9.3"],
    confidence: 0.8,
    validationStatus: "VERIFIED",
  },
  {
    id: "finding-context",
    title: "Governing law missing from sample metadata",
    category: "UNCERTAIN",
    severity: "LOW",
    summary: "The fixture does not include jurisdiction context for legal-review checks.",
    clauseRefs: ["Metadata"],
    confidence: 0.72,
    validationStatus: "NEEDS_REVIEW",
  },
];
