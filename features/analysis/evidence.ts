import type { ContractClause, Evidence } from "../../schemas/contract.ts";
import { evidenceSchema } from "../../schemas/contract.ts";
import { normalizeContractText, stableHash } from "../ingestion/text.ts";

export function normalizeEvidenceText(text: string) {
  return normalizeContractText(text)
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function validateEvidenceText(evidenceText: string, clause: ContractClause) {
  const normalizedEvidence = normalizeEvidenceText(evidenceText);
  const normalizedClause = normalizeEvidenceText(clause.text);

  return Boolean(normalizedEvidence) && normalizedClause.includes(normalizedEvidence);
}

export function validateEvidenceAgainstClauses(
  evidence: Evidence[],
  clauses: ContractClause[],
) {
  const clauseById = new Map(clauses.map((clause) => [clause.id, clause]));

  return evidence.map((item) => {
    const clause = clauseById.get(item.clauseId);
    const validationStatus =
      clause && validateEvidenceText(item.text, clause) ? "VERIFIED" : "NEEDS_REVIEW";

    return evidenceSchema.parse({
      ...item,
      validationStatus,
    });
  });
}

export function evidenceForClause(
  clause: ContractClause,
  hint: RegExp,
  index: number,
): Evidence {
  const sentence =
    clause.text
      .split(/(?<=[.!?])\s+/)
      .find((part) => hint.test(part)) ?? clause.text.slice(0, 260);
  const excerpt = sentence.trim().slice(0, 320);

  return evidenceSchema.parse({
    id: `evidence-${index + 1}-${stableHash(`${clause.id}:${excerpt}`)}`,
    clauseId: clause.id,
    text: excerpt,
    normalizedText: normalizeEvidenceText(excerpt),
    sourceSpanIds: clause.sourceSpanIds,
    validationStatus: validateEvidenceText(excerpt, clause) ? "VERIFIED" : "NEEDS_REVIEW",
  });
}
