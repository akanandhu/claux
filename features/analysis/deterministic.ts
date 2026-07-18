import type {
  AiExtractionOutput,
  ContractClause,
  Evidence,
  ReviewerContext,
} from "../../schemas/contract.ts";
import { aiExtractionOutputSchema } from "../../schemas/contract.ts";
import type { DemoFinding, DemoMetric } from "../demo/types";
import { evidenceForClause } from "./evidence.ts";
import { extractCandidateParties } from "./parties.ts";

type RiskTone = DemoMetric["tone"];

const riskPatterns = [
  {
    category: "COMMERCIAL_RISK",
    type: "liability_cap",
    severity: "HIGH",
    title: "Liability language may limit recovery",
    hint: /\b(liability|cap|limit|exclude|damages)\b/i,
  },
  {
    category: "COMMERCIAL_RISK",
    type: "payment_pressure",
    severity: "MEDIUM",
    title: "Payment terms may create operational leverage",
    hint: /\b(payment|invoice|fee|interest|suspend|late)\b/i,
  },
  {
    category: "CONTRACT_SMELL",
    type: "termination_dependency",
    severity: "MEDIUM",
    title: "Termination rights depend on connected conditions",
    hint: /\b(terminate|termination|breach|cure|notice)\b/i,
  },
  {
    category: "CONTRACT_SMELL",
    type: "confidentiality_survival",
    severity: "LOW",
    title: "Confidentiality duties may survive the agreement",
    hint: /\b(confidential|survive|survival|disclos)\b/i,
  },
] as const;

export function buildDeterministicExtraction(
  clauses: ContractClause[],
  reviewerContext: ReviewerContext,
): AiExtractionOutput {
  const evidence: Evidence[] = [];
  const findings = [];

  for (const pattern of riskPatterns) {
    const clause = clauses.find((candidate) => pattern.hint.test(candidate.text));
    if (!clause) continue;

    const evidenceItem = evidenceForClause(clause, pattern.hint, evidence.length);
    evidence.push(evidenceItem);
    const verified = evidenceItem.validationStatus === "VERIFIED";

    findings.push({
      id: `finding-${pattern.type}`,
      category: pattern.category,
      type: pattern.type,
      severity: pattern.severity,
      title: pattern.title,
      summary: summarizeFinding(pattern.type, reviewerContext.relationship),
      clauseIds: [clause.id],
      evidenceIds: [evidenceItem.id],
      affectedParty: reviewerContext.reviewingPartyName,
      benefitingParty: undefined,
      reviewingPartyImpact:
        reviewerContext.status === "confirmed"
          ? roleImpact(pattern.type, reviewerContext.relationship)
          : undefined,
      confidence: verified ? 0.72 : 0.42,
      validationStatus: verified ? "VERIFIED" : "NEEDS_REVIEW",
    });
  }

  if (!clauses.some((clause) => /\bgoverning law\b/i.test(clause.text))) {
    const fallbackClause = clauses[0]!;
    const evidenceItem = evidenceForClause(fallbackClause, /./, evidence.length);
    evidence.push(evidenceItem);
    findings.push({
      id: "finding-governing-law-context",
      category: "UNCERTAIN",
      type: "missing_governing_law_context",
      severity: "LOW",
      title: "Governing law context was not detected",
      summary:
        "Jurisdiction-specific legal enforceability has not been assessed because governing law was not detected in the parsed clauses.",
      clauseIds: [fallbackClause.id],
      evidenceIds: [evidenceItem.id],
      affectedParty: reviewerContext.reviewingPartyName,
      benefitingParty: undefined,
      reviewingPartyImpact: undefined,
      confidence: 0.64,
      validationStatus: "NEEDS_REVIEW",
    });
  }

  return aiExtractionOutputSchema.parse({
    parties: extractCandidateParties(clauses),
    evidence,
    findings,
  });
}

export function buildMetrics({
  clauses,
  evidence,
  findings,
}: {
  clauses: ContractClause[];
  evidence: Evidence[];
  findings: AiExtractionOutput["findings"];
}): DemoMetric[] {
  const verifiedEvidence = evidence.filter(
    (item) => item.validationStatus === "VERIFIED",
  ).length;
  const evidenceCoverage = evidence.length
    ? Math.round((verifiedEvidence / evidence.length) * 100)
    : 0;
  const highFindings = findings.filter((finding) =>
    ["HIGH", "CRITICAL"].includes(finding.severity),
  ).length;
  const referenceCount = clauses.reduce(
    (count, clause) => count + clause.explicitReferenceIds.length,
    0,
  );
  const health = Math.max(
    0,
    100 -
      findings.filter((finding) => finding.validationStatus !== "VERIFIED").length * 8 -
      highFindings * 10,
  );

  return [
    metric(
      "contract-health",
      "Contract Health",
      `${health} / 100`,
      health >= 80 ? "Good structure" : "Needs review",
      health >= 80 ? "success" : "warning",
    ),
    metric(
      "commercial-risk",
      "Commercial Risk",
      highFindings > 0 ? "High" : findings.length > 0 ? "Medium" : "Low",
      `${findings.length} verified or reviewable findings`,
      highFindings > 0 ? "danger" : findings.length > 0 ? "warning" : "success",
    ),
    metric(
      "contract-complexity",
      "Contract Complexity",
      clauses.length > 40 || referenceCount > 20 ? "High" : clauses.length > 12 ? "Medium" : "Low",
      `${clauses.length} clauses / ${referenceCount} references`,
      clauses.length > 40 || referenceCount > 20 ? "danger" : clauses.length > 12 ? "warning" : "success",
    ),
    metric(
      "explainability",
      "Explainability",
      `${evidenceCoverage}%`,
      `${verifiedEvidence} verified excerpts`,
      evidenceCoverage >= 80 ? "accent" : "warning",
    ),
  ];
}

export function toDemoFindings(
  findings: AiExtractionOutput["findings"],
  clauses: ContractClause[],
): DemoFinding[] {
  const clauseById = new Map(clauses.map((clause) => [clause.id, clause]));

  return findings.map((finding) => ({
    id: finding.id,
    title: finding.title,
    category: finding.category,
    severity: finding.severity,
    summary: finding.reviewingPartyImpact ?? finding.summary,
    clauseRefs: finding.clauseIds.map((clauseId) => {
      const clause = clauseById.get(clauseId);
      return clause?.number ?? clause?.title ?? clauseId;
    }),
    confidence: finding.confidence,
    validationStatus:
      finding.validationStatus === "VERIFIED"
        ? "VERIFIED"
        : finding.validationStatus === "PARTIALLY_VERIFIED"
          ? "PARTIALLY_VERIFIED"
          : "NEEDS_REVIEW",
  }));
}

function metric(
  id: string,
  label: string,
  value: string,
  detail: string,
  tone: RiskTone,
): DemoMetric {
  return { id, label, value, detail, tone };
}

function summarizeFinding(type: string, relationship: ReviewerContext["relationship"]) {
  if (type === "liability_cap") {
    return relationship === "received"
      ? "Check whether recovery is capped or excluded for losses that matter to you."
      : "Check whether the cap and exclusions match the risk position you intended to send.";
  }

  if (type === "payment_pressure") {
    return relationship === "received"
      ? "Payment deadlines, late charges, or suspension language may reduce dispute leverage."
      : "Payment remedies should be clear enough to enforce operationally without overreaching.";
  }

  if (type === "termination_dependency") {
    return "Termination rights should be read with breach, notice, cure, and post-termination obligations.";
  }

  return "Survival and confidentiality language should match the actual confidentiality period expected by the parties.";
}

function roleImpact(type: string, relationship: ReviewerContext["relationship"]) {
  if (relationship === "prepared") {
    return type === "payment_pressure"
      ? "As drafter, confirm the remedy is enforceable, commercially reasonable, and not likely to slow signature."
      : "As drafter, confirm the clause protects your position without creating ambiguity or negotiation weakness.";
  }

  return type === "liability_cap"
    ? "As recipient, this may reduce the practical recovery available if the other party breaches."
    : "As recipient, this may shift leverage toward the sender unless the connected conditions are acceptable.";
}
