import { contractOutline, type ContractSection } from "./fixture/outline";

export function findContractClause(
  clauseId: string | null,
  outline: ContractSection[] = contractOutline,
) {
  if (!clauseId) return undefined;

  for (const section of outline) {
    const clause = section.children.find((item) => item.id === clauseId);
    if (clause) return { clause, section };
  }

  return undefined;
}

export function findContractSection(
  sectionId: string | null,
  outline: ContractSection[] = contractOutline,
) {
  if (!sectionId) return undefined;
  return outline.find((section) => section.id === sectionId);
}
