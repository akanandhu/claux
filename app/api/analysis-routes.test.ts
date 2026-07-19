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
const partyClause: ContractClause = {
  id: "clause-parties",
  number: "0",
  title: "Parties",
  text: 'This Agreement is between Acme Inc. ("Provider") and Beta LLC ("Customer").',
  normalizedText:
    'This Agreement is between Acme Inc. ("Provider") and Beta LLC ("Customer").',
  level: 1,
  pageStart: 1,
  pageEnd: 1,
  startOffset: 0,
  endOffset: 76,
  explicitReferenceIds: [],
  sourceSpanIds: ["span-0"],
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
    assert.equal(body.contractMetadata.contractType, "Services agreement");
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

test("POST /api/analyze infers recipient-side review in one response", async () => {
  const response = await analyzeWithoutOpenAi({
    clauses: [partyClause, clause],
    reviewerContext: {
      relationship: "received",
      status: "unresolved",
    },
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.reviewerResolution, "resolved");
  assert.equal(body.requiresClarification, false);
  assert.equal(body.inferredReviewingParty.role, "Customer");
  assert.equal(body.summaries.length > 0, true);
  assert.equal(Array.isArray(body.counterpartyGlance), true);
});

test("POST /api/analyze infers drafter-side review in one response", async () => {
  const response = await analyzeWithoutOpenAi({
    clauses: [partyClause, clause],
    reviewerContext: {
      relationship: "prepared",
      status: "unresolved",
    },
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.reviewerResolution, "resolved");
  assert.equal(body.inferredReviewingParty.role, "Provider");
  assert.match(body.deepAnalysisForParty.summary, /Provider/);
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

async function analyzeWithoutOpenAi(body: unknown) {
  const oldKey = process.env.OPENAI_API_KEY;
  const oldModel = process.env.OPENAI_MODEL;
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_MODEL;

  try {
    return await analyzePost(jsonRequest(body));
  } finally {
    process.env.OPENAI_API_KEY = oldKey;
    process.env.OPENAI_MODEL = oldModel;
  }
}
