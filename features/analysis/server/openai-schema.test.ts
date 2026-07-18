import assert from "node:assert/strict";
import test from "node:test";

import {
  analyzeResponseOpenAiSchema,
  stripNullProperties,
} from "./openai-schema.ts";

test("analyze response OpenAI schema uses strict required object properties", () => {
  assertStrictObjectSchemas(analyzeResponseOpenAiSchema);
});

test("analyze response OpenAI schema does not emit unsupported defaults", () => {
  assertNoKeyword(analyzeResponseOpenAiSchema, "default");
});

test("analyze response OpenAI schema models optional fields as required nullable fields", () => {
  const properties = analyzeResponseOpenAiSchema.properties!;

  assertIncludes(analyzeResponseOpenAiSchema.required, "inferredReviewingParty");
  assertIncludes(analyzeResponseOpenAiSchema.required, "deepAnalysisForParty");
  assert.deepEqual(properties.inferredReviewingParty.anyOf?.at(-1), {
    type: "null",
  });
  assert.deepEqual(properties.deepAnalysisForParty.anyOf?.at(-1), {
    type: "null",
  });

  const party = properties.parties.items!;
  assertIncludes(party.required, "role");
  assert.deepEqual(party.properties!.role.type, ["string", "null"]);

  const finding = properties.findings.items!;
  assertIncludes(finding.required, "affectedParty");
  assertIncludes(finding.required, "benefitingParty");
  assertIncludes(finding.required, "reviewingPartyImpact");
  assert.deepEqual(finding.properties!.affectedParty.type, ["string", "null"]);

  const suggestion = properties.suggestions.items!;
  assertIncludes(suggestion.required, "findingId");
  assert.deepEqual(suggestion.properties!.findingId.type, ["string", "null"]);
});

test("stripNullProperties removes OpenAI nullable placeholders before Zod parsing", () => {
  const stripped = stripNullProperties({
    inferredReviewingParty: null,
    parties: [
      {
        id: "party-customer",
        name: "Customer",
        aliases: [],
        role: null,
        confidence: 0.9,
      },
    ],
    suggestions: [
      {
        id: "suggestion-1",
        findingId: null,
        evidenceIds: ["evidence-1"],
      },
    ],
  }) as {
    inferredReviewingParty?: unknown;
    parties: Array<{ role?: unknown }>;
    suggestions: Array<{ findingId?: unknown }>;
  };

  assert.equal("inferredReviewingParty" in stripped, false);
  assert.equal("role" in stripped.parties[0]!, false);
  assert.equal("findingId" in stripped.suggestions[0]!, false);
});

function assertStrictObjectSchemas(schema: unknown, path = "$") {
  if (!schema || typeof schema !== "object") return;

  const node = schema as {
    additionalProperties?: unknown;
    anyOf?: unknown[];
    items?: unknown;
    properties?: Record<string, unknown>;
    required?: unknown;
    type?: unknown;
  };

  if (node.properties) {
    assert.equal(
      node.additionalProperties,
      false,
      `${path} must disallow additional properties`,
    );
    assert.deepEqual(
      new Set(node.required as string[]),
      new Set(Object.keys(node.properties)),
      `${path} must require every declared property`,
    );

    for (const [key, child] of Object.entries(node.properties)) {
      assertStrictObjectSchemas(child, `${path}.${key}`);
    }
  }

  if (node.items) {
    assertStrictObjectSchemas(node.items, `${path}[]`);
  }

  for (const [index, child] of node.anyOf?.entries() ?? []) {
    assertStrictObjectSchemas(child, `${path}.anyOf[${index}]`);
  }
}

function assertNoKeyword(schema: unknown, keyword: string, path = "$") {
  if (!schema || typeof schema !== "object") return;

  const node = schema as Record<string, unknown>;
  assert.equal(
    keyword in node,
    false,
    `${path} must not include ${keyword}`,
  );

  for (const [key, value] of Object.entries(node)) {
    assertNoKeyword(value, keyword, `${path}.${key}`);
  }
}

function assertIncludes(values: string[] | undefined, expected: string) {
  assert.equal(values?.includes(expected), true);
}
