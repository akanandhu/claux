import "server-only";

type JsonSchema = {
  additionalProperties?: false;
  anyOf?: JsonSchema[];
  enum?: string[];
  items?: JsonSchema;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  type?: string | string[];
};

const stringSchema: JsonSchema = { type: "string" };
const nullableStringSchema: JsonSchema = { type: ["string", "null"] };
const numberSchema: JsonSchema = { type: "number" };
const booleanSchema: JsonSchema = { type: "boolean" };

function arraySchema(items: JsonSchema): JsonSchema {
  return { type: "array", items };
}

function enumSchema(values: string[]): JsonSchema {
  return { type: "string", enum: values };
}

function objectSchema(properties: Record<string, JsonSchema>): JsonSchema {
  return {
    type: "object",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  };
}

function nullableSchema(schema: JsonSchema): JsonSchema {
  return { anyOf: [schema, { type: "null" }] };
}

const validationStatusSchema = enumSchema([
  "VERIFIED",
  "PARTIALLY_VERIFIED",
  "UNVERIFIED",
  "REJECTED",
  "NEEDS_REVIEW",
]);

const partySchema = objectSchema({
  id: stringSchema,
  name: stringSchema,
  aliases: arraySchema(stringSchema),
  role: nullableStringSchema,
  confidence: numberSchema,
});

const evidenceSchema = objectSchema({
  id: stringSchema,
  clauseId: stringSchema,
  text: stringSchema,
  normalizedText: stringSchema,
  sourceSpanIds: arraySchema(stringSchema),
  validationStatus: validationStatusSchema,
});

const findingSchema = objectSchema({
  id: stringSchema,
  category: enumSchema([
    "STRUCTURAL_DIAGNOSTIC",
    "CONTRACT_SMELL",
    "COMMERCIAL_RISK",
    "LEGAL_REVIEW_SIGNAL",
    "UNCERTAIN",
  ]),
  type: stringSchema,
  severity: enumSchema(["INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  title: stringSchema,
  summary: stringSchema,
  clauseIds: arraySchema(stringSchema),
  evidenceIds: arraySchema(stringSchema),
  affectedParty: nullableStringSchema,
  benefitingParty: nullableStringSchema,
  reviewingPartyImpact: nullableStringSchema,
  confidence: numberSchema,
  validationStatus: validationStatusSchema,
});

const partyImpactSchema = objectSchema({
  partyId: nullableStringSchema,
  partyName: stringSchema,
  affectedParty: nullableStringSchema,
  benefitingParty: nullableStringSchema,
  impact: stringSchema,
  severityAdjustment: enumSchema(["lower", "same", "higher", "unknown"]),
  confidence: numberSchema,
});

const deepAnalysisForPartySchema = objectSchema({
  partyId: nullableStringSchema,
  partyName: stringSchema,
  perspective: enumSchema(["recipient", "drafter", "unknown"]),
  summary: stringSchema,
  partyImpacts: arraySchema(partyImpactSchema),
});

const counterpartyGlanceSchema = objectSchema({
  partyId: nullableStringSchema,
  partyName: stringSchema,
  role: nullableStringSchema,
  summary: stringSchema,
  keyConcerns: arraySchema(stringSchema),
  confidence: numberSchema,
});

const suggestionSchema = objectSchema({
  id: stringSchema,
  findingId: nullableStringSchema,
  clauseId: stringSchema,
  direction: stringSchema,
  rationale: stringSchema,
  evidenceIds: arraySchema(stringSchema),
  validationStatus: validationStatusSchema,
});

export const analyzeResponseOpenAiSchema = objectSchema({
  parties: arraySchema(partySchema),
  evidence: arraySchema(evidenceSchema),
  findings: arraySchema(findingSchema),
  identifiedParties: arraySchema(partySchema),
  inferredReviewingParty: nullableSchema(partySchema),
  inferenceConfidence: numberSchema,
  reviewerResolution: enumSchema([
    "resolved",
    "requires_confirmation",
    "unresolved",
  ]),
  requiresClarification: booleanSchema,
  candidateReviewingPartyIds: arraySchema(stringSchema),
  deepAnalysisForParty: nullableSchema(deepAnalysisForPartySchema),
  counterpartyGlance: arraySchema(counterpartyGlanceSchema),
  summaries: arraySchema(stringSchema),
  suggestions: arraySchema(suggestionSchema),
  validationStatus: validationStatusSchema,
});

export function stripNullProperties(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripNullProperties);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => item !== null)
      .map(([key, item]) => [key, stripNullProperties(item)]),
  );
}
