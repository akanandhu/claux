import type { ParsedDocument, ReviewerContext } from "../../schemas/contract.ts";
import type { ContractClause } from "../../schemas/contract.ts";
import type {
  DemoAnalysisFixture,
  DemoEvidence,
  DemoGraphEdge,
  DemoGraphNode,
  DemoInspector,
  DemoOutlineSection,
} from "../demo/types";
import {
  buildDeterministicExtraction,
  buildMetrics,
  toDemoFindings,
} from "./deterministic.ts";

export function buildLiveAnalysisFixture({
  clauses,
  document,
  reviewerContext,
}: {
  clauses: ContractClause[];
  document: ParsedDocument;
  reviewerContext: ReviewerContext;
}): DemoAnalysisFixture {
  const extraction = buildDeterministicExtraction(clauses, reviewerContext);
  const metrics = buildMetrics({
    clauses,
    evidence: extraction.evidence,
    findings: extraction.findings,
  });
  const inspectors = clauses.slice(0, 24).map((clause, index) =>
    inspectorForClause({
      clause,
      evidence: extraction.evidence
        .filter((item) => item.clauseId === clause.id)
        .map((item) => ({
          id: item.id,
          clauseRef: clause.number ?? clause.title ?? clause.id,
          page: clause.pageStart,
          excerpt: item.text,
          validationStatus:
            item.validationStatus === "VERIFIED"
              ? "VERIFIED"
              : item.validationStatus === "PARTIALLY_VERIFIED"
                ? "PARTIALLY_VERIFIED"
                : "NEEDS_REVIEW",
        })),
      finding: extraction.findings.find((item) => item.clauseIds.includes(clause.id)),
      index,
    }),
  );

  return {
    contract: {
      fileName: document.fileName,
      contractType: inferContractType(clauses),
      reviewingRole: reviewerContext.reviewingPartyName ?? "Unconfirmed reviewer",
      effectiveDate: "Not detected",
      pageCount: document.pageCount ?? document.pages.length,
      clauseCount: clauses.length,
      analysisCompletedAt: new Date().toISOString(),
    },
    navItems: [
      { id: "overview", label: "Overview", count: metrics.length },
      { id: "clauses", label: "Clauses", count: clauses.length },
      { id: "obligations", label: "Obligations", count: countMatches(clauses, /\bshall|must|required\b/i) },
      { id: "risks", label: "Commercial risks", count: extraction.findings.filter((finding) => finding.category === "COMMERCIAL_RISK").length },
      { id: "smells", label: "Contract smells", count: extraction.findings.filter((finding) => finding.category === "CONTRACT_SMELL").length },
      { id: "evidence", label: "Evidence links", count: extraction.evidence.length },
    ],
    metrics,
    graph: graphForClauses(clauses, extraction.findings),
    defaultInspectorId: inspectors[0]?.id ?? "contract-summary",
    inspectors:
      inspectors.length > 0 ? inspectors : [emptyInspector(document.fileName)],
    executiveSummary: buildExecutiveSummary(
      clauses.length,
      extraction.findings.length,
      reviewerContext,
    ),
    outline: outlineForClauses(clauses, extraction.findings),
    topFindings: toDemoFindings(extraction.findings, clauses),
  };
}

function inspectorForClause({
  clause,
  evidence,
  finding,
  index,
}: {
  clause: ContractClause;
  evidence: DemoEvidence[];
  finding: ReturnType<typeof buildDeterministicExtraction>["findings"][number] | undefined;
  index: number;
}): DemoInspector {
  const severity = finding?.severity;

  return {
    id: `inspector-${clause.id}`,
    nodeId: clause.id,
    clauseRef: clause.number ?? `Clause ${index + 1}`,
    title: clause.title ?? clause.text.split(/\s+/).slice(0, 7).join(" "),
    nodeType: "CLAUSE",
    severity,
    confidence: finding?.confidence ?? 0.68,
    labels: [finding?.category ?? "FACT"],
    summary: finding?.summary ?? clause.text.slice(0, 220),
    keyInfo: [
      {
        label: "Source",
        value: `Page ${clause.pageStart}, offsets ${clause.startOffset}-${clause.endOffset}`,
      },
    ],
    dependencyChain: clause.explicitReferenceIds.map((referenceId) => ({
      id: `${clause.id}-${referenceId}`,
      label: referenceId,
      relationship: "Explicit cross-reference detected in source text.",
      severity: "INFO",
    })),
    evidence,
    commercialImpact:
      finding?.reviewingPartyImpact ??
      "No directional commercial-risk score is shown until the reviewing party is confirmed.",
    uncertainty:
      evidence.every((item) => item.validationStatus === "VERIFIED")
        ? "All visible evidence for this clause matched the extracted source text."
        : "Some evidence needs review before treating it as verified fact.",
    suggestedAction:
      finding?.validationStatus === "VERIFIED"
        ? "Review the source-backed finding and connected clauses before deciding whether to accept the term."
        : "Confirm the evidence before relying on this interpretation.",
    history: [
      {
        label: "Extracted locally",
        detail: "Clause text and offsets were produced in the browser.",
      },
      {
        label: "Evidence checked",
        detail: "Visible evidence is validated against the extracted clause text.",
      },
    ],
  };
}

function graphForClauses(
  clauses: ContractClause[],
  findings: ReturnType<typeof buildDeterministicExtraction>["findings"],
) {
  const nodes: DemoGraphNode[] = [
    { id: "contract", label: "Contract", type: "CONTRACT", x: 80, y: 120, size: 52 },
    ...clauses.slice(0, 8).map((clause, index) => ({
      id: clause.id,
      label: clause.number ? `${clause.number} ${clause.title ?? "Clause"}` : clause.title ?? `Clause ${index + 1}`,
      type: "CLAUSE" as const,
      x: 250 + (index % 4) * 150,
      y: 60 + Math.floor(index / 4) * 130,
      size: 42,
      inspectorId: `inspector-${clause.id}`,
    })),
    ...findings.slice(0, 4).map((finding, index) => ({
      id: finding.id,
      label: finding.title,
      type: "FINDING" as const,
      x: 860,
      y: 70 + index * 110,
      size: 44,
    })),
  ];
  const edges: DemoGraphEdge[] = clauses.slice(0, 8).map((clause) => ({
    id: `contract-${clause.id}`,
    source: "contract",
    target: clause.id,
    type: "CONTAINS",
    confidence: 0.9,
    pathType: "dependency",
  }));

  for (const finding of findings.slice(0, 4)) {
    const clauseId = finding.clauseIds[0];
    if (!clauseId) continue;
    edges.push({
      id: `${clauseId}-${finding.id}`,
      source: clauseId,
      target: finding.id,
      type: "SUPPORTED_BY",
      confidence: finding.confidence,
      pathType: finding.severity === "HIGH" ? "risk" : "reference",
      dashed: finding.validationStatus !== "VERIFIED",
    });
  }

  return { nodes, edges };
}

function emptyInspector(fileName: string): DemoInspector {
  return {
    id: "contract-summary",
    nodeId: "contract",
    clauseRef: fileName,
    title: "Contract summary",
    nodeType: "CONTRACT",
    confidence: 0,
    labels: ["UNCERTAIN"],
    summary: "No clause-like legal content was available for inspection.",
    keyInfo: [],
    dependencyChain: [],
    evidence: [],
    commercialImpact: "No commercial-risk interpretation was produced.",
    uncertainty: "Analysis did not run.",
    suggestedAction: "Upload a clause-based contract.",
    history: [],
  };
}

function inferContractType(clauses: ContractClause[]) {
  const text = clauses.map((clause) => clause.text).join("\n");
  if (/\bnon-disclosure|confidentiality agreement|nda\b/i.test(text)) return "NDA";
  if (/\bservice|subscription|software|platform|saas\b/i.test(text)) {
    return "Services agreement";
  }
  if (/\blemployment|employee\b/i.test(text)) return "Employment agreement";
  return "Contract";
}

function outlineForClauses(
  clauses: ContractClause[],
  findings: ReturnType<typeof buildDeterministicExtraction>["findings"],
): DemoOutlineSection[] {
  const findingByClauseId = new Map(
    findings.flatMap((finding) =>
      finding.clauseIds.map((clauseId) => [clauseId, finding] as const),
    ),
  );
  const groups = new Map<string, ContractClause[]>();

  for (const clause of clauses) {
    const groupKey = clause.number?.split(".")[0] ?? "unclassified";
    groups.set(groupKey, [...(groups.get(groupKey) ?? []), clause]);
  }

  return [...groups.entries()].map(([groupKey, groupClauses], index) => {
    const sectionRisk = highestRisk(
      groupClauses.map(
        (clause) => severityToRisk(findingByClauseId.get(clause.id)?.severity),
      ),
    );
    const firstClause = groupClauses[0]!;
    const hazards = groupClauses
      .map((clause) => findingByClauseId.get(clause.id)?.title)
      .filter((title): title is string => Boolean(title));

    return {
      id: `section-${groupKey}`,
      label:
        firstClause.title && groupClauses.length === 1
          ? firstClause.title
          : groupKey === "unclassified"
            ? `Extracted clauses ${index + 1}`
            : `Section ${groupKey}`,
      count: groupClauses.length,
      risk: sectionRisk,
      plainEnglishSummary: `${groupClauses.length} extracted clause${
        groupClauses.length === 1 ? "" : "s"
      } grouped from the source document.`,
      hazards:
        hazards.length > 0
          ? hazards
          : ["No verified commercial-risk finding was attached to this section."],
      signGuidance:
        "Directional signing or sending guidance is only shown after the reviewing party is confirmed.",
      children: groupClauses.map((clause, clauseIndex) => ({
        id: clause.id,
        label:
          clause.number && clause.title
            ? `${clause.number} ${clause.title}`
            : clause.title ?? `Clause ${clauseIndex + 1}`,
        risk: severityToRisk(findingByClauseId.get(clause.id)?.severity),
        summary: findingByClauseId.get(clause.id)?.summary ?? clause.text.slice(0, 180),
      })),
    };
  });
}

function severityToRisk(severity?: string): "Low" | "Medium" | "High" {
  if (severity === "HIGH" || severity === "CRITICAL") return "High";
  if (severity === "MEDIUM") return "Medium";
  return "Low";
}

function highestRisk(risks: Array<"Low" | "Medium" | "High">) {
  if (risks.includes("High")) return "High";
  if (risks.includes("Medium")) return "Medium";
  return "Low";
}

function countMatches(clauses: ContractClause[], pattern: RegExp) {
  return clauses.filter((clause) => pattern.test(clause.text)).length;
}

function buildExecutiveSummary(
  clauseCount: number,
  findingCount: number,
  reviewerContext: ReviewerContext,
) {
  const roleLine =
    reviewerContext.status === "confirmed"
      ? `Directional review is framed for ${reviewerContext.reviewingPartyName}.`
      : "Directional risk and signing guidance are blocked until the reviewing party is confirmed.";

  return [
    `${clauseCount} clauses were extracted locally and mapped to source offsets.`,
    `${findingCount} source-backed findings were generated from deterministic contract signals.`,
    roleLine,
  ];
}
