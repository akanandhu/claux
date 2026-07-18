import assert from "node:assert/strict";
import test from "node:test";

import {
  analyzeRequestSchema,
  contractClauseSchema,
  interpretRequestSchema,
} from "./contract.ts";

const clause = {
  id: "clause-1",
  number: "1",
  title: "Payment",
  text: "1. Payment. Customer shall pay Provider within 30 days.",
  normalizedText: "1. Payment. Customer shall pay Provider within 30 days.",
  level: 1,
  pageStart: 1,
  pageEnd: 1,
  startOffset: 0,
  endOffset: 58,
  explicitReferenceIds: [],
  sourceSpanIds: ["span-1"],
};

test("contract clause schema preserves source text and offsets", () => {
  const parsed = contractClauseSchema.parse(clause);

  assert.equal(parsed.text, clause.text);
  assert.equal(parsed.startOffset, 0);
  assert.equal(parsed.endOffset, 58);
});

test("analyze request accepts clauses with an unresolved reviewer context", () => {
  const parsed = analyzeRequestSchema.parse({
    clauses: [clause],
    reviewerContext: {
      relationship: "received",
      status: "unresolved",
    },
  });

  assert.equal(parsed.clauses.length, 1);
});

test("interpret request requires a confirmed reviewing party", () => {
  const result = interpretRequestSchema.safeParse({
    clauses: [clause],
    reviewerContext: {
      relationship: "received",
      status: "requires_confirmation",
      reviewingPartyId: "party-customer",
    },
    findings: [],
    evidence: [],
  });

  assert.equal(result.success, false);
});
