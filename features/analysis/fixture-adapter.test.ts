import assert from "node:assert/strict";
import test from "node:test";

import type {
  AiExtractionOutput,
  ContractClause,
  ParsedDocument,
} from "../../schemas/contract.ts";
import { buildLiveAnalysisFixture } from "./fixture-adapter.ts";

const clause: ContractClause = {
  id: "clause-liability",
  number: "1",
  title: "Liability",
  text: "Provider's liability is capped at fees paid in the prior twelve months.",
  normalizedText: "Provider's liability is capped at fees paid in the prior twelve months.",
  level: 1,
  pageStart: 1,
  pageEnd: 1,
  startOffset: 0,
  endOffset: 67,
  explicitReferenceIds: [],
  sourceSpanIds: ["span-1"],
};

const document: ParsedDocument = {
  fileName: "agreement.txt",
  fileType: "txt",
  fileSize: 67,
  pageCount: 1,
  rawText: clause.text,
  normalizedText: clause.normalizedText,
  pages: [
    {
      pageNumber: 1,
      rawText: clause.text,
      normalizedText: clause.normalizedText,
      startOffset: 0,
      endOffset: 67,
    },
  ],
  sourceSpans: [],
};

test("buildLiveAnalysisFixture downgrades unsupported API evidence client-side", () => {
  const analysisResult: AiExtractionOutput = {
    parties: [],
    evidence: [
      {
        id: "evidence-hallucinated",
        clauseId: clause.id,
        text: "This sentence is not in the source clause.",
        normalizedText: "this sentence is not in the source clause.",
        sourceSpanIds: [],
        validationStatus: "VERIFIED",
      },
    ],
    findings: [
      {
        id: "finding-liability",
        category: "COMMERCIAL_RISK",
        type: "liability_cap",
        severity: "HIGH",
        title: "Liability cap",
        summary: "The cap may reduce recovery.",
        clauseIds: [clause.id],
        evidenceIds: ["evidence-hallucinated"],
        affectedParty: "Customer",
        reviewingPartyImpact: "As recipient, this may reduce practical recovery.",
        confidence: 0.9,
        validationStatus: "VERIFIED",
      },
    ],
  };

  const fixture = buildLiveAnalysisFixture({
    analysisResult,
    clauses: [clause],
    document,
    reviewerContext: {
      relationship: "received",
      reviewingPartyId: "party-customer",
      reviewingPartyName: "Customer",
      status: "confirmed",
    },
  });

  assert.equal(fixture.inspectors[0]?.evidence[0]?.validationStatus, "NEEDS_REVIEW");
  assert.equal(fixture.topFindings[0]?.summary.includes("recipient"), true);
  assert.equal(fixture.topFindings[0]?.validationStatus, "NEEDS_REVIEW");
});
