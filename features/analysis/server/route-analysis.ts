import "server-only";

import { z } from "zod";

import type {
  AiExtractionOutput,
  AnalyzeResponse,
  ContractClause,
  Evidence,
  InterpretResponse,
  ReviewerContext,
} from "../../../schemas/contract.ts";
import {
  aiExtractionOutputSchema,
  analyzeResponseSchema,
  interpretResponseSchema,
} from "../../../schemas/contract.ts";
import { buildDeterministicExtraction } from "../deterministic.ts";
import { validateEvidenceAgainstClauses } from "../evidence.ts";

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
  const extraction =
    process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL
      ? await callAnalyzeModel({ clauses, reviewerContext })
      : buildDeterministicExtraction(clauses, reviewerContext);
  const evidence = validateEvidenceAgainstClauses(extraction.evidence, clauses);

  return analyzeResponseSchema.parse({
    ...extraction,
    evidence,
    findings: gateFindingsByEvidence(extraction.findings, evidence),
    validationStatus: evidence.every((item) => item.validationStatus === "VERIFIED")
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
        (evidenceId) => evidenceById.get(evidenceId)?.validationStatus === "VERIFIED",
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
    schema: z.toJSONSchema(aiExtractionOutputSchema),
    input: [
      {
        role: "system",
        content:
          "Extract contract parties, source-backed commercial risk findings, and evidence. Use only the supplied clause text. Do not assess legal enforceability.",
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

  return aiExtractionOutputSchema.parse(modelOutput);
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
    throw new Error("OpenAI analysis request failed.");
  }

  return JSON.parse(extractResponsesText((await response.json()) as ResponsesApiPayload));
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
