import assert from "node:assert/strict";
import test from "node:test";

import type {
  AiExtractionOutput,
  ContractClause,
  Evidence,
} from "../../schemas/contract.ts";
import {
  buildDeterministicExtraction,
  buildMetrics,
  toDemoFindings,
} from "./deterministic.ts";
import { validateEvidenceText } from "./evidence.ts";
import { extractCandidateParties } from "./parties.ts";

const clauses: ContractClause[] = [
  clause("c1", "1", "Parties", 'This Agreement is between Acme Inc. ("Provider") and Beta LLC ("Customer").'),
  clause("c2", "2", "Payment", "Customer shall pay all invoices within 30 days. Provider may suspend overdue services."),
  clause("c3", "3", "Liability", "Provider's liability is capped at fees paid in the prior twelve months."),
];

test("extractCandidateParties detects defined party names and roles", () => {
  const parties = extractCandidateParties(clauses);

  assert.equal(parties.some((party) => party.id === "party-provider"), true);
  assert.equal(parties.some((party) => party.id === "party-customer"), true);
});

test("validateEvidenceText tolerates normalized whitespace and case", () => {
  assert.equal(validateEvidenceText("customer SHALL pay all invoices", clauses[1]!), true);
});

test("buildDeterministicExtraction produces role-aware verified findings", () => {
  const extraction = buildDeterministicExtraction(clauses, {
    relationship: "received",
    reviewingPartyId: "party-customer",
    reviewingPartyName: "Customer",
    status: "confirmed",
  });

  assert.equal(extraction.findings.some((finding) => finding.type === "liability_cap"), true);
  assert.equal(
    extraction.findings.every((finding) =>
      finding.evidenceIds.every((evidenceId) =>
        extraction.evidence.some((evidence) => evidence.id === evidenceId),
      ),
    ),
    true,
  );
  assert.equal(
    extraction.findings.some((finding) =>
      finding.reviewingPartyImpact?.includes("recipient"),
    ),
    true,
  );
});

test("buildMetrics computes explainability from verified evidence", () => {
  const extraction = buildDeterministicExtraction(clauses, {
    relationship: "prepared",
    reviewingPartyId: "party-provider",
    reviewingPartyName: "Provider",
    status: "confirmed",
  });
  const metrics = buildMetrics({
    clauses,
    evidence: extraction.evidence,
    findings: extraction.findings,
  });

  assert.match(metrics.find((metric) => metric.id === "explainability")?.value ?? "", /%$/);
});

test("buildMetrics gives full explainability for verified findings across all clauses", () => {
  const metrics = buildMetrics({
    clauses: clauses.slice(0, 2),
    evidence: [
      evidence("e1", "c1", "VERIFIED"),
      evidence("e2", "c2", "VERIFIED"),
    ],
    findings: [
      finding("f1", ["c1"], ["e1"], "VERIFIED"),
      finding("f2", ["c2"], ["e2"], "VERIFIED"),
    ],
  });

  assert.equal(metricValue(metrics, "explainability"), "100%");
  assert.match(
    metricDetail(metrics, "explainability"),
    /2\/2 findings verified/,
  );
  assert.match(
    metricDetail(metrics, "explainability"),
    /2\/2 clauses supported/,
  );
});

test("buildMetrics lowers explainability for unverified evidence and unsupported clauses", () => {
  const metrics = buildMetrics({
    clauses,
    evidence: [
      evidence("e1", "c1", "VERIFIED"),
      evidence("e2", "c2", "NEEDS_REVIEW"),
    ],
    findings: [
      finding("f1", ["c1"], ["e1"], "VERIFIED"),
      finding("f2", ["c2"], ["e2"], "NEEDS_REVIEW"),
    ],
  });

  assert.equal(metricValue(metrics, "explainability"), "45%");
  assert.match(
    metricDetail(metrics, "explainability"),
    /1\/2 findings verified/,
  );
  assert.match(
    metricDetail(metrics, "explainability"),
    /1\/3 clauses supported/,
  );
});

test("buildMetrics reports zero explainability without evidence-backed findings", () => {
  const metrics = buildMetrics({
    clauses,
    evidence: [],
    findings: [finding("f1", ["c1"], [], "NEEDS_REVIEW")],
  });

  assert.equal(metricValue(metrics, "explainability"), "0%");
  assert.match(metricDetail(metrics, "explainability"), /0\/1 findings verified/);
});

test("toDemoFindings carries evidence validation status into visible findings", () => {
  const extraction = buildDeterministicExtraction(clauses, {
    relationship: "received",
    reviewingPartyId: "party-customer",
    reviewingPartyName: "Customer",
    status: "confirmed",
  });
  const demoFindings = toDemoFindings(extraction.findings, clauses);

  assert.equal(
    demoFindings.some((finding) => finding.validationStatus === "NEEDS_REVIEW"),
    true,
  );
  assert.equal(
    demoFindings.every((finding) =>
      ["VERIFIED", "PARTIALLY_VERIFIED", "NEEDS_REVIEW"].includes(
        finding.validationStatus,
      ),
    ),
    true,
  );
});

function clause(
  id: string,
  number: string,
  title: string,
  text: string,
): ContractClause {
  return {
    id,
    number,
    title,
    text,
    normalizedText: text,
    level: 1,
    pageStart: 1,
    pageEnd: 1,
    startOffset: 0,
    endOffset: text.length,
    explicitReferenceIds: [],
    sourceSpanIds: [`span-${id}`],
  };
}

function evidence(
  id: string,
  clauseId: string,
  validationStatus: Evidence["validationStatus"],
): Evidence {
  return {
    id,
    clauseId,
    text: "source text",
    normalizedText: "source text",
    sourceSpanIds: [`span-${clauseId}`],
    validationStatus,
  };
}

function finding(
  id: string,
  clauseIds: string[],
  evidenceIds: string[],
  validationStatus: AiExtractionOutput["findings"][number]["validationStatus"],
): AiExtractionOutput["findings"][number] {
  return {
    id,
    category: "COMMERCIAL_RISK",
    type: "test",
    severity: "MEDIUM",
    title: "Test finding",
    summary: "Test summary",
    clauseIds,
    evidenceIds,
    confidence: 0.8,
    validationStatus,
  };
}

function metricValue(
  metrics: ReturnType<typeof buildMetrics>,
  id: string,
) {
  return metrics.find((metric) => metric.id === id)?.value;
}

function metricDetail(
  metrics: ReturnType<typeof buildMetrics>,
  id: string,
) {
  return metrics.find((metric) => metric.id === id)?.detail ?? "";
}
