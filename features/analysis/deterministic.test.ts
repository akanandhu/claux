import assert from "node:assert/strict";
import test from "node:test";

import type { ContractClause } from "../../schemas/contract.ts";
import { buildDeterministicExtraction, buildMetrics } from "./deterministic.ts";
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
