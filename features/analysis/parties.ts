import type { ContractClause, Party } from "../../schemas/contract.ts";
import { partySchema } from "../../schemas/contract.ts";
import { slugify } from "../ingestion/text.ts";

const definedPartyPattern =
  /([A-Z][A-Za-z0-9&.,' -]{2,80}?)\s*\(\s*["“](Customer|Client|Provider|Supplier|Vendor|Company|Contractor|Disclosing Party|Receiving Party|Licensor|Licensee)["”]\s*\)/g;
const betweenPattern =
  /\bbetween\s+([A-Z][A-Za-z0-9&.,' -]{2,80}?)\s+and\s+([A-Z][A-Za-z0-9&.,' -]{2,80}?)(?:\.|,|\n|$)/i;
const roleTerms = [
  "Customer",
  "Client",
  "Provider",
  "Supplier",
  "Vendor",
  "Company",
  "Contractor",
  "Disclosing Party",
  "Receiving Party",
  "Licensor",
  "Licensee",
];

export function extractCandidateParties(clauses: ContractClause[]): Party[] {
  const parties = new Map<string, Party>();
  const openingText = clauses
    .slice(0, 4)
    .map((clause) => clause.text)
    .join("\n");

  for (const match of openingText.matchAll(definedPartyPattern)) {
    addParty(parties, match[1]!.trim(), match[2]!.trim(), 0.88);
  }

  const betweenMatch = openingText.match(betweenPattern);
  if (betweenMatch) {
    addParty(parties, betweenMatch[1]!.trim(), undefined, 0.68);
    addParty(parties, betweenMatch[2]!.trim(), undefined, 0.68);
  }

  const allText = clauses.map((clause) => clause.text).join("\n");
  for (const role of roleTerms) {
    const occurrences = allText.match(new RegExp(`\\b${escapeRegExp(role)}\\b`, "gi"));
    if (occurrences && occurrences.length >= 2) {
      addParty(parties, role, role, role.includes("Party") ? 0.7 : 0.76);
    }
  }

  return [...parties.values()].slice(0, 8);
}

function addParty(
  parties: Map<string, Party>,
  name: string,
  role: string | undefined,
  confidence: number,
) {
  const cleanedName = name.replace(/\s+/g, " ").replace(/[,.]$/, "").trim();
  const key = slugify(role ?? cleanedName);
  const existing = parties.get(key);

  parties.set(
    key,
    partySchema.parse({
      id: `party-${key}`,
      name: existing?.name ?? cleanedName,
      aliases: [...new Set([...(existing?.aliases ?? []), role, cleanedName].filter(Boolean))],
      role: role ?? existing?.role,
      confidence: Math.max(existing?.confidence ?? 0, confidence),
    }),
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
