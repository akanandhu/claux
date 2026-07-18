import assert from "node:assert/strict";
import test from "node:test";

import { POST as analyzePost } from "./analyze/route.ts";
import { POST as interpretPost } from "./interpret/route.ts";
import type { ContractClause } from "../../schemas/contract.ts";

const clause: ContractClause = {
  id: "clause-payment",
  number: "1",
  title: "Payment",
  text: "Customer shall pay Provider within 30 days. Provider may suspend overdue services.",
  normalizedText:
    "Customer shall pay Provider within 30 days. Provider may suspend overdue services.",
  level: 1,
  pageStart: 1,
  pageEnd: 1,
  startOffset: 0,
  endOffset: 79,
  explicitReferenceIds: [],
  sourceSpanIds: ["span-1"],
};

test("POST /api/analyze validates request bodies", async () => {
  const response = await analyzePost(jsonRequest({ clauses: [] }));

  assert.equal(response.status, 400);
});

test("POST /api/analyze returns evidence-gated deterministic output without OpenAI config", async () => {
  const oldKey = process.env.OPENAI_API_KEY;
  const oldModel = process.env.OPENAI_MODEL;
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_MODEL;

  try {
    const response = await analyzePost(
      jsonRequest({
        clauses: [clause],
        reviewerContext: {
          relationship: "received",
          reviewingPartyId: "party-customer",
          reviewingPartyName: "Customer",
          status: "confirmed",
        },
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(
      body.findings.every((finding: { validationStatus: string }) =>
        ["VERIFIED", "NEEDS_REVIEW"].includes(finding.validationStatus),
      ),
      true,
    );
  } finally {
    process.env.OPENAI_API_KEY = oldKey;
    process.env.OPENAI_MODEL = oldModel;
  }
});

test("POST /api/interpret blocks unconfirmed reviewer context", async () => {
  const response = await interpretPost(
    jsonRequest({
      clauses: [clause],
      reviewerContext: {
        relationship: "received",
        reviewingPartyId: "party-customer",
        reviewingPartyName: "Customer",
        status: "requires_confirmation",
      },
      findings: [],
      evidence: [],
    }),
  );

  assert.equal(response.status, 400);
});

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
