import { z } from "zod";

export const validationStatusSchema = z.enum([
  "VERIFIED",
  "PARTIALLY_VERIFIED",
  "UNVERIFIED",
  "REJECTED",
  "NEEDS_REVIEW",
]);

export const findingSeveritySchema = z.enum([
  "INFO",
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

export const sourceSpanSchema = z.object({
  id: z.string().min(1),
  pageNumber: z.number().int().positive().optional(),
  sectionPath: z.array(z.string().min(1)).default([]),
  paragraphIndex: z.number().int().nonnegative().optional(),
  lineStart: z.number().int().positive().optional(),
  lineEnd: z.number().int().positive().optional(),
  startOffset: z.number().int().nonnegative(),
  endOffset: z.number().int().nonnegative(),
  text: z.string().min(1),
});

export const parsedPageSchema = z.object({
  pageNumber: z.number().int().positive(),
  rawText: z.string(),
  normalizedText: z.string(),
  startOffset: z.number().int().nonnegative(),
  endOffset: z.number().int().nonnegative(),
});

export const parsedDocumentSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.enum(["pdf", "docx", "txt"]),
  fileSize: z.number().int().nonnegative(),
  pageCount: z.number().int().positive().optional(),
  rawText: z.string(),
  normalizedText: z.string(),
  pages: z.array(parsedPageSchema).min(1),
  sourceSpans: z.array(sourceSpanSchema).default([]),
});

export const contractClauseSchema = z.object({
  id: z.string().min(1),
  number: z.string().optional(),
  title: z.string().optional(),
  text: z.string().min(1),
  normalizedText: z.string().min(1),
  level: z.number().int().min(1).max(6),
  pageStart: z.number().int().positive(),
  pageEnd: z.number().int().positive(),
  startOffset: z.number().int().nonnegative(),
  endOffset: z.number().int().nonnegative(),
  parentClauseId: z.string().optional(),
  explicitReferenceIds: z.array(z.string()).default([]),
  sourceSpanIds: z.array(z.string()).default([]),
});

export const partySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  role: z.string().optional(),
  confidence: z.number().min(0).max(1),
});

export const reviewerResolutionSchema = z.enum([
  "resolved",
  "requires_confirmation",
  "unresolved",
]);

export const reviewerContextSchema = z.object({
  relationship: z.enum(["received", "prepared"]),
  reviewingPartyId: z.string().optional(),
  reviewingPartyName: z.string().optional(),
  status: z.enum(["unresolved", "requires_confirmation", "confirmed"]),
});

export const evidenceSchema = z.object({
  id: z.string().min(1),
  clauseId: z.string().min(1),
  text: z.string().min(1),
  normalizedText: z.string().min(1),
  sourceSpanIds: z.array(z.string()).default([]),
  validationStatus: validationStatusSchema,
});

export const partyImpactSchema = z.object({
  partyId: z.string().optional(),
  partyName: z.string().min(1),
  affectedParty: z.string().optional(),
  benefitingParty: z.string().optional(),
  impact: z.string().min(1),
  severityAdjustment: z.enum(["lower", "same", "higher", "unknown"]).default("same"),
  confidence: z.number().min(0).max(1),
});

export const aiExtractionOutputSchema = z.object({
  parties: z.array(partySchema).default([]),
  evidence: z.array(evidenceSchema).default([]),
  findings: z
    .array(
      z.object({
        id: z.string().min(1),
        category: z.enum([
          "STRUCTURAL_DIAGNOSTIC",
          "CONTRACT_SMELL",
          "COMMERCIAL_RISK",
          "LEGAL_REVIEW_SIGNAL",
          "UNCERTAIN",
        ]),
        type: z.string().min(1),
        severity: findingSeveritySchema,
        title: z.string().min(1),
        summary: z.string().min(1),
        clauseIds: z.array(z.string().min(1)).min(1),
        evidenceIds: z.array(z.string().min(1)).default([]),
        affectedParty: z.string().optional(),
        benefitingParty: z.string().optional(),
        reviewingPartyImpact: z.string().optional(),
        confidence: z.number().min(0).max(1),
        validationStatus: validationStatusSchema,
      }),
    )
    .default([]),
});

export const graphNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum([
    "CONTRACT",
    "SECTION",
    "CLAUSE",
    "PARTY",
    "DEFINED_TERM",
    "OBLIGATION",
    "RIGHT",
    "PROHIBITION",
    "CONDITION",
    "DATE",
    "VALUE",
    "REFERENCE",
    "FINDING",
    "EVIDENCE",
  ]),
  clauseIds: z.array(z.string()).default([]),
  evidenceIds: z.array(z.string()).default([]),
  validationStatus: validationStatusSchema.default("VERIFIED"),
});

export const graphEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  type: z.enum([
    "CONTAINS",
    "PART_OF",
    "REFERENCES",
    "DEFINES",
    "USES",
    "MENTIONS_PARTY",
    "ASSIGNED_TO",
    "BENEFITS",
    "GRANTS_RIGHT_TO",
    "PROHIBITS",
    "DEPENDS_ON",
    "TRIGGERED_BY",
    "HAS_DEADLINE",
    "HAS_VALUE",
    "HAS_CONSEQUENCE",
    "MODIFIES",
    "SUPERSEDES",
    "CONTRADICTS",
    "SUPPORTED_BY",
    "AFFECTS",
  ]),
  confidence: z.number().min(0).max(1),
  sourceClauseIds: z.array(z.string()).default([]),
  evidenceIds: z.array(z.string()).default([]),
  extractionMethod: z.enum(["deterministic", "ai", "hybrid"]),
  validationStatus: validationStatusSchema,
});

export const metricSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  detail: z.string().min(1),
  tone: z.enum(["neutral", "success", "warning", "danger", "accent"]),
});

export const suggestionSchema = z.object({
  id: z.string().min(1),
  findingId: z.string().optional(),
  clauseId: z.string().min(1),
  direction: z.string().min(1),
  rationale: z.string().min(1),
  evidenceIds: z.array(z.string()).default([]),
  validationStatus: validationStatusSchema,
});

export const counterpartyGlanceSchema = z.object({
  partyId: z.string().optional(),
  partyName: z.string().min(1),
  role: z.string().optional(),
  summary: z.string().min(1),
  keyConcerns: z.array(z.string().min(1)).default([]),
  confidence: z.number().min(0).max(1),
});

export const deepAnalysisForPartySchema = z.object({
  partyId: z.string().optional(),
  partyName: z.string().min(1),
  perspective: z.enum(["recipient", "drafter", "unknown"]),
  summary: z.string().min(1),
  partyImpacts: z.array(partyImpactSchema).default([]),
});

export const contractMetadataSchema = z.object({
  title: z.string().min(1),
  contractType: z.string().min(1),
});

export const analyzeRequestSchema = z.object({
  clauses: z.array(contractClauseSchema).min(1),
  reviewerContext: reviewerContextSchema,
});

export const analyzeResponseSchema = aiExtractionOutputSchema.extend({
  contractMetadata: contractMetadataSchema,
  identifiedParties: z.array(partySchema).default([]),
  inferredReviewingParty: partySchema.optional(),
  inferenceConfidence: z.number().min(0).max(1).default(0),
  reviewerResolution: reviewerResolutionSchema.default("unresolved"),
  requiresClarification: z.boolean().default(false),
  candidateReviewingPartyIds: z.array(z.string()).default([]),
  deepAnalysisForParty: deepAnalysisForPartySchema.optional(),
  counterpartyGlance: z.array(counterpartyGlanceSchema).default([]),
  summaries: z.array(z.string().min(1)).default([]),
  suggestions: z.array(suggestionSchema).default([]),
  validationStatus: validationStatusSchema,
});

export const interpretRequestSchema = z.object({
  clauses: z.array(contractClauseSchema).min(1),
  reviewerContext: reviewerContextSchema.refine(
    (context) => context.status === "confirmed" && Boolean(context.reviewingPartyId),
    "A confirmed reviewing party is required for role-aware interpretation.",
  ),
  findings: aiExtractionOutputSchema.shape.findings,
  evidence: z.array(evidenceSchema).default([]),
});

export const interpretResponseSchema = z.object({
  summaries: z.array(z.string().min(1)).default([]),
  suggestions: z.array(suggestionSchema).default([]),
});

export type SourceSpan = z.infer<typeof sourceSpanSchema>;
export type ParsedDocument = z.infer<typeof parsedDocumentSchema>;
export type ContractClause = z.infer<typeof contractClauseSchema>;
export type Party = z.infer<typeof partySchema>;
export type PartyImpact = z.infer<typeof partyImpactSchema>;
export type ReviewerContext = z.infer<typeof reviewerContextSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export type AiExtractionOutput = z.infer<typeof aiExtractionOutputSchema>;
export type ContractMetadata = z.infer<typeof contractMetadataSchema>;
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;
export type InterpretRequest = z.infer<typeof interpretRequestSchema>;
export type InterpretResponse = z.infer<typeof interpretResponseSchema>;
