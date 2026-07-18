import "server-only";

import { z } from "zod";

import type {
  AiExtractionOutput,
  AnalyzeResponse,
  ContractClause,
  Evidence,
  InterpretResponse,
  Party,
  ReviewerContext,
} from "../../../schemas/contract.ts";
import {
  analyzeResponseSchema,
  interpretResponseSchema,
} from "../../../schemas/contract.ts";
import { buildDeterministicExtraction } from "../deterministic.ts";
import { validateEvidenceAgainstClauses } from "../evidence.ts";
import { extractCandidateParties } from "../parties.ts";
import {
  analyzeResponseOpenAiSchema,
  stripNullProperties,
} from "./openai-schema.ts";

type ResponsesApiPayload = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
};

export async function analyzeClauses({
  clauses,
  reviewerContext,
}: {
  clauses: ContractClause[];
  reviewerContext: ReviewerContext;
}): Promise<AnalyzeResponse> {
  const analysis =
    process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL
      ? await callAnalyzeModel({ clauses, reviewerContext })
      : deterministicSingleCallAnalysis({ clauses, reviewerContext });
  const evidence = validateEvidenceAgainstClauses(analysis.evidence, clauses);
  const findings = gateFindingsByEvidence(analysis.findings, evidence);
  const identifiedParties = analysis.identifiedParties.length
    ? analysis.identifiedParties
    : analysis.parties;
  const inference = normalizeInference({
    analysis,
    identifiedParties,
    reviewerContext,
  });
  const suggestions = analysis.suggestions.map((suggestion) => {
    const verified =
      suggestion.evidenceIds.length > 0 &&
      suggestion.evidenceIds.every(
        (evidenceId) =>
          evidence.find((item) => item.id === evidenceId)?.validationStatus ===
          "VERIFIED",
      );

    return {
      ...suggestion,
      validationStatus: verified ? "VERIFIED" : "NEEDS_REVIEW",
    };
  });

  return analyzeResponseSchema.parse({
    ...analysis,
    evidence,
    findings,
    identifiedParties,
    parties: identifiedParties,
    suggestions,
    ...inference,
    validationStatus: evidence.every(
      (item) => item.validationStatus === "VERIFIED",
    )
      ? "VERIFIED"
      : "NEEDS_REVIEW",
  });
}

export async function interpretFindings({
  findings,
  reviewerContext,
}: {
  findings: AiExtractionOutput["findings"];
  reviewerContext: ReviewerContext;
}): Promise<InterpretResponse> {
  const response =
    process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL
      ? await callInterpretModel({ findings, reviewerContext })
      : deterministicInterpretation({ findings, reviewerContext });

  return interpretResponseSchema.parse(response);
}

function gateFindingsByEvidence(
  findings: AiExtractionOutput["findings"],
  evidence: Evidence[],
) {
  const evidenceById = new Map(evidence.map((item) => [item.id, item]));

  return findings.map((finding) => {
    const hasOnlyVerifiedEvidence =
      finding.evidenceIds.length > 0 &&
      finding.evidenceIds.every(
        (evidenceId) =>
          evidenceById.get(evidenceId)?.validationStatus === "VERIFIED",
      );

    return {
      ...finding,
      validationStatus: hasOnlyVerifiedEvidence ? "VERIFIED" : "NEEDS_REVIEW",
    };
  });
}

async function callAnalyzeModel({
  clauses,
  reviewerContext,
}: {
  clauses: ContractClause[];
  reviewerContext: ReviewerContext;
}) {
  const modelOutput = await callResponsesJson({
    name: "claux_clause_analysis",
    schema: analyzeResponseOpenAiSchema,
    input: [
      {
        role: "system",
        content: [
          "You are Claux, a source-grounded contract analysis engine.",
          "Use only the supplied clause text. Never regenerate or rewrite source clauses.",
          "Extract all explicit legal parties and infer the single most likely party represented by the user from reviewerContext.relationship.",
          "If relationship is received, infer the likely recipient/offeree/counterparty side. If relationship is prepared, infer the likely drafter/originator/offeror side.",
          "Run deep risk, negotiation, and drafting-direction analysis only for the inferred reviewing party.",
          "Return lightweight counterpartyGlance summaries for other identified parties.",
          "Set requiresClarification true when the represented party cannot be confidently mapped, especially with three or more plausible parties.",
          "Every finding and suggestion must cite evidence IDs from the evidence array. Do not make unsupported factual claims.",
          "Do not assess legal enforceability or jurisdiction-specific legality.",
          "Suggestions must be drafting directions, not ready-to-use legal language.",
        ].join(" "),
      },
      {
        role: "user",
        content: JSON.stringify({
          reviewerContext,
          clauses: clauses.map((clause) => ({
            id: clause.id,
            number: clause.number,
            title: clause.title,
            text: clause.text,
          })),
        }),
      },
    ],
  });

  return analyzeResponseSchema.parse(stripNullProperties(modelOutput));
}

function deterministicSingleCallAnalysis({
  clauses,
  reviewerContext,
}: {
  clauses: ContractClause[];
  reviewerContext: ReviewerContext;
}): AnalyzeResponse {
  const identifiedParties = extractCandidateParties(clauses);
  const inference = inferReviewingParty(identifiedParties, reviewerContext);
  const effectiveReviewerContext: ReviewerContext =
    inference.inferredReviewingParty && !inference.requiresClarification
      ? {
          relationship: reviewerContext.relationship,
          reviewingPartyId: inference.inferredReviewingParty.id,
          reviewingPartyName:
            inference.inferredReviewingParty.role ??
            inference.inferredReviewingParty.name,
          status: "confirmed",
        }
      : {
          relationship: reviewerContext.relationship,
          status: inference.requiresClarification
            ? "requires_confirmation"
            : "unresolved",
        };
  const extraction = buildDeterministicExtraction(
    clauses,
    effectiveReviewerContext,
  );
  const deepPartyName =
    inference.inferredReviewingParty?.role ??
    inference.inferredReviewingParty?.name ??
    "the likely reviewing party";

  return analyzeResponseSchema.parse({
    ...extraction,
    identifiedParties,
    parties: identifiedParties,
    ...inference,
    counterpartyGlance: identifiedParties
      .filter((party) => party.id !== inference.inferredReviewingParty?.id)
      .map((party) => ({
        partyId: party.id,
        partyName: party.role ?? party.name,
        role: party.role,
        summary:
          "Counterparty role identified from source text; full directional analysis was not run for this party.",
        keyConcerns: [
          "Use the full-analysis action before relying on this party view.",
        ],
        confidence: party.confidence,
      })),
    deepAnalysisForParty: {
      partyId: inference.inferredReviewingParty?.id,
      partyName: deepPartyName,
      perspective:
        reviewerContext.relationship === "prepared" ? "drafter" : "recipient",
      summary: `Deep analysis is framed for ${deepPartyName}.`,
      partyImpacts: extraction.findings.map((finding) => ({
        partyId: inference.inferredReviewingParty?.id,
        partyName: deepPartyName,
        affectedParty: finding.affectedParty,
        benefitingParty: finding.benefitingParty,
        impact:
          finding.reviewingPartyImpact ??
          "Directional impact could not be confidently assigned.",
        severityAdjustment: "same",
        confidence: finding.confidence,
      })),
    },
    summaries: extraction.findings.slice(0, 4).map((finding) => {
      return `${deepPartyName}: ${finding.reviewingPartyImpact ?? finding.summary}`;
    }),
    suggestions: extraction.findings
      .filter((finding) => finding.validationStatus === "VERIFIED")
      .slice(0, 4)
      .map((finding) => ({
        id: `suggestion-${finding.id}`,
        findingId: finding.id,
        clauseId: finding.clauseIds[0]!,
        direction:
          reviewerContext.relationship === "prepared"
            ? "Clarify the drafting position, trigger, affected party, and remedy so the term is easier to defend in negotiation."
            : "Identify the trigger, affected party, and practical remedy to decide what should be redlined.",
        rationale:
          "The direction is tied to verified source evidence and is not final legal language.",
        evidenceIds: finding.evidenceIds,
        validationStatus: "VERIFIED",
      })),
    validationStatus: "VERIFIED",
  });
}

function normalizeInference({
  analysis,
  identifiedParties,
  reviewerContext,
}: {
  analysis: AnalyzeResponse;
  identifiedParties: Party[];
  reviewerContext: ReviewerContext;
}) {
  const fallback = inferReviewingParty(identifiedParties, reviewerContext);
  const inferredReviewingParty =
    analysis.inferredReviewingParty ?? fallback.inferredReviewingParty;
  const inferenceConfidence = Math.max(
    analysis.inferenceConfidence,
    fallback.inferenceConfidence,
  );
  const requiresClarification =
    analysis.requiresClarification ||
    fallback.requiresClarification ||
    inferenceConfidence < 0.72;

  return {
    inferredReviewingParty,
    inferenceConfidence,
    reviewerResolution: requiresClarification
      ? "requires_confirmation"
      : inferredReviewingParty
        ? "resolved"
        : "unresolved",
    requiresClarification,
    candidateReviewingPartyIds:
      analysis.candidateReviewingPartyIds.length > 0
        ? analysis.candidateReviewingPartyIds
        : fallback.candidateReviewingPartyIds,
  } as const;
}

function inferReviewingParty(
  parties: Party[],
  reviewerContext: ReviewerContext,
): {
  candidateReviewingPartyIds: string[];
  inferredReviewingParty?: Party;
  inferenceConfidence: number;
  requiresClarification: boolean;
  reviewerResolution: "resolved" | "requires_confirmation" | "unresolved";
} {
  if (reviewerContext.reviewingPartyId) {
    const explicitParty = parties.find(
      (party) => party.id === reviewerContext.reviewingPartyId,
    );

    if (explicitParty) {
      return {
        candidateReviewingPartyIds: [explicitParty.id],
        inferredReviewingParty: explicitParty,
        inferenceConfidence: 0.98,
        requiresClarification: false,
        reviewerResolution: "resolved",
      };
    }
  }

  const inferred =
    reviewerContext.relationship === "prepared"
      ? inferPreparedParty(parties)
      : inferReceivedParty(parties);
  const candidateReviewingPartyIds =
    parties.length > 0 ? parties.map((party) => party.id) : [];

  if (!inferred) {
    return {
      candidateReviewingPartyIds,
      inferenceConfidence: 0,
      requiresClarification: true,
      reviewerResolution: "unresolved",
    };
  }

  const requiresClarification = parties.length > 2 && inferred.confidence < 0.9;

  return {
    candidateReviewingPartyIds,
    inferredReviewingParty: inferred,
    inferenceConfidence: inferred.confidence,
    requiresClarification,
    reviewerResolution: requiresClarification
      ? "requires_confirmation"
      : "resolved",
  };
}

function inferPreparedParty(parties: Party[]) {
  return (
    findPartyByRole(parties, [
      "Provider",
      "Supplier",
      "Vendor",
      "Company",
      "Contractor",
      "Licensor",
      "Disclosing Party",
    ]) ?? parties[0]
  );
}

function inferReceivedParty(parties: Party[]) {
  return (
    findPartyByRole(parties, [
      "Customer",
      "Client",
      "Licensee",
      "Receiving Party",
      "Borrower",
      "Guarantor",
    ]) ?? (parties.length > 1 ? parties[1] : parties[0])
  );
}

function findPartyByRole(parties: Party[], roles: string[]) {
  return parties.find((party) =>
    roles.some((role) =>
      [party.role, party.name, ...party.aliases].some(
        (value) => value?.toLowerCase() === role.toLowerCase(),
      ),
    ),
  );
}

async function callInterpretModel({
  findings,
  reviewerContext,
}: {
  findings: AiExtractionOutput["findings"];
  reviewerContext: ReviewerContext;
}) {
  return callResponsesJson({
    name: "claux_role_interpretation",
    schema: z.toJSONSchema(interpretResponseSchema),
    input: [
      {
        role: "system",
        content:
          "Explain verified contract findings for the confirmed reviewing party. Suggestions must be drafting directions, not final legal language.",
      },
      {
        role: "user",
        content: JSON.stringify({ reviewerContext, findings }),
      },
    ],
  });
}

async function callResponsesJson({
  input,
  name,
  schema,
}: {
  input: Array<{ role: "system" | "user"; content: string }>;
  name: string;
  schema: unknown;
}) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL,
      input,
      text: {
        format: {
          type: "json_schema",
          name,
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      [
        `OpenAI analysis request failed (${response.status}).`,
        errorBody.slice(0, 600),
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  return JSON.parse(
    extractResponsesText((await response.json()) as ResponsesApiPayload),
  );
}

function extractResponsesText(payload: ResponsesApiPayload) {
  if (payload.output_text) return payload.output_text;

  for (const output of payload.output ?? []) {
    for (const content of output.content ?? []) {
      if (content.text) return content.text;
    }
  }

  throw new Error("OpenAI response did not include JSON text.");
}

function deterministicInterpretation({
  findings,
  reviewerContext,
}: {
  findings: AiExtractionOutput["findings"];
  reviewerContext: ReviewerContext;
}): InterpretResponse {
  return {
    summaries: findings.slice(0, 4).map((finding) => {
      const party = reviewerContext.reviewingPartyName ?? "the reviewing party";
      return `${party}: ${finding.reviewingPartyImpact ?? finding.summary}`;
    }),
    suggestions: findings
      .filter((finding) => finding.validationStatus === "VERIFIED")
      .slice(0, 4)
      .map((finding) => ({
        id: `suggestion-${finding.id}`,
        findingId: finding.id,
        clauseId: finding.clauseIds[0]!,
        direction:
          "Clarify the commercial trigger, affected party, and practical remedy tied to this finding.",
        rationale:
          "The direction is tied to verified source evidence and should be reviewed before drafting final language.",
        evidenceIds: finding.evidenceIds,
        validationStatus: "VERIFIED",
      })),
  };
}
