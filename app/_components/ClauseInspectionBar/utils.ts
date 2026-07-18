import type { ContractSection } from "@/features/demo/fixture/outline";
import type { findContractClause } from "@/features/demo/utils";

export const riskRank: Record<ContractSection["risk"], number> = {
  High: 3,
  Low: 1,
  Medium: 2,
};

export function riskBadgeTone(risk: ContractSection["risk"]) {
  if (risk === "High") return "danger";
  if (risk === "Medium") return "warning";
  return "success";
}

export function clauseHazards({
  label,
  risk,
}: NonNullable<ReturnType<typeof findContractClause>>["clause"]) {
  if (risk === "High") {
    return [
      `${label} can materially change payment, remedy, or operational leverage.`,
      "The connected section should be reviewed before relying on the summary.",
      "A nearby exception or cross-reference may change the practical result.",
    ];
  }

  if (risk === "Medium") {
    return [
      `${label} can still affect day-to-day performance or negotiation leverage.`,
      "Confirm the clause matches the commercial expectation before signing.",
    ];
  }

  return [
    `${label} appears lower risk, but it can still affect how later clauses are interpreted.`,
  ];
}

export function clauseWhyItMatters({
  risk,
  summary,
}: NonNullable<ReturnType<typeof findContractClause>>["clause"]) {
  return [
    summary,
    risk === "High"
      ? "Because this is high risk, it should be checked before the contract is treated as acceptable."
      : "This should be checked against the surrounding section so the contract is interpreted consistently.",
  ];
}
