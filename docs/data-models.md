# Data Models and Contracts

These shapes describe the intended domain. Prefer Zod schemas as the executable
source of truth and infer TypeScript types from them where practical.

## Workspace and document

```ts
type LocalWorkspace = {
  primary: ContractSession | null;
  comparison: ContractSession | null;
  activeView: "primary" | "comparison" | "diff";
};

type ContractSession = {
  slot: "primary" | "comparison";
  fileName: string;
  fileType: string;
  fileSize: number;
  fileHash: string;
  createdAt: string;
  legalContext: LegalContext;
  document: ParsedDocument;
  clauses: ContractClause[];
  analysis: ContractAnalysis;
};

type ParsedDocument = {
  fileName: string;
  pageCount?: number;
  rawText: string;
  pages: ParsedPage[];
};

type ParsedPage = {
  pageNumber: number;
  rawText: string;
  normalizedText: string;
  startOffset: number;
  endOffset: number;
};

type ContractClause = {
  id: string;
  number?: string;
  title?: string;
  text: string;
  normalizedText: string;
  level: number;
  pageStart: number;
  pageEnd: number;
  startOffset: number;
  endOffset: number;
  parentClauseId?: string;
  explicitReferenceIds: string[];
};
```

## Legal context

```ts
type LegalContext = {
  reviewingPartyId?: string;
  reviewingRole:
    | "buyer" | "seller" | "customer" | "service_provider"
    | "employer" | "employee" | "licensor" | "licensee"
    | "landlord" | "tenant" | "disclosing_party" | "receiving_party"
    | "other";
  contractType:
    | "nda" | "saas" | "services" | "employment" | "vendor"
    | "licensing" | "lease" | "distribution" | "other";
  governingCountry?: string;
  governingState?: string;
  effectiveDate?: string;
  counterpartyType?: "business" | "consumer" | "employee" | "contractor";
};
```

If jurisdiction is absent, explicitly say legal enforceability has not been
assessed and ask the user to select governing law for jurisdiction-specific
checks.

## Graph ontology

Node types: `CONTRACT`, `SECTION`, `CLAUSE`, `PARTY`, `DEFINED_TERM`,
`OBLIGATION`, `RIGHT`, `PROHIBITION`, `CONDITION`, `DATE`, `VALUE`, `REFERENCE`,
`FINDING`, and `EVIDENCE`.

Edge types: `CONTAINS`, `PART_OF`, `REFERENCES`, `DEFINES`, `USES`,
`MENTIONS_PARTY`, `ASSIGNED_TO`, `BENEFITS`, `GRANTS_RIGHT_TO`, `PROHIBITS`,
`DEPENDS_ON`, `TRIGGERED_BY`, `HAS_DEADLINE`, `HAS_VALUE`, `HAS_CONSEQUENCE`,
`MODIFIES`, `SUPERSEDES`, `CONTRADICTS`, `SUPPORTED_BY`, and `AFFECTS`.

```ts
type ContractEdge = {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  confidence: number;
  sourceClauseIds: string[];
  evidenceIds: string[];
  extractionMethod: "deterministic" | "ai" | "hybrid";
  validationStatus:
    | "VERIFIED" | "PARTIALLY_VERIFIED" | "UNVERIFIED"
    | "REJECTED" | "NEEDS_REVIEW";
};
```

## Extraction and findings

```ts
type ExtractedObligation = {
  id: string;
  actor: string;
  action: string;
  beneficiary?: string;
  deadline?: { raw: string; normalized?: string };
  condition?: string;
  consequence?: string;
  modality: "shall" | "must" | "will" | "required" | "other";
  clauseId: string;
  evidenceText: string;
  confidence: number;
};

type ContractFinding = {
  id: string;
  category: "STRUCTURAL" | "SMELL" | "COMMERCIAL_RISK" | "LEGAL_REVIEW";
  type: string;
  severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  summary: string;
  clauseIds: string[];
  evidenceIds: string[];
  confidence?: number;
  deterministic: boolean;
  reviewStatus: "OPEN" | "DISMISSED" | "CONFIRMED";
};
```

At the presentation layer, keep `FACT`, `STRUCTURAL_DIAGNOSTIC`,
`CONTRACT_SMELL`, `COMMERCIAL_RISK`, `LEGAL_REVIEW_SIGNAL`,
`NEGOTIATION_SUGGESTION`, and `UNCERTAIN` distinguishable.

## Route contracts

### `POST /api/analyze`

Input: `{ clauses: ContractClause[]; legalContext: LegalContext }`.

Output contains typed parties, definitions, obligations, rights, prohibitions,
conditions, dates, values, semantic edges, evidence, and extraction uncertainties.

### `POST /api/interpret`

Input: validated graph, deterministic findings, legal context, selected party.  
Output: commercial-risk explanations, concise reasoning summaries, and review
recommendations.

### `POST /api/negotiate`

Input: selected clause, finding, role, and connected clauses.  
Output: proposed wording, rationale, trade-off, and affected dependencies.

### `POST /api/legal-check`

Optional for MVP. Input: clause, issue type, jurisdiction, and a retrieved
authoritative rule. Output: review status, basis, source, limitations, and
confidence.