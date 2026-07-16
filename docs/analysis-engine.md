# Analysis Engine

## Responsibility boundary

AI may identify parties and roles, obligations, rights, prohibitions, conditions,
exceptions, dates, durations, values, definitions, references, consequences,
survival obligations, ambiguity, and evidence. It may explain already-validated
findings and suggest rewrites.

Deterministic TypeScript owns document offsets, clause IDs, source mapping,
evidence checks, graph assembly, metrics, paths, dependency depth, cycles,
connected components, articulation points, orphan/leaf detection, definition and
reference checks, duplicate detection, graph diffs, and confidence thresholds.

Use Structured Outputs validated by Zod. Never accept free-form JSON or ask the
model to calculate objective graph metrics.

## Evidence validation gate

For every extracted item:

- The referenced clause exists.
- Evidence text is non-empty and appears in the normalized source clause.
- Extracted values and dates appear in source text.
- Clause references resolve or are explicitly marked unresolved.
- Party names map to known parties or remain explicitly unresolved.
- Confidence is between 0 and 1.

```ts
function validateEvidence(evidenceText: string, clause: ContractClause): boolean {
  return normalize(clause.text).includes(normalize(evidenceText));
}
```

Use `VERIFIED`, `PARTIALLY_VERIFIED`, `UNVERIFIED`, `REJECTED`, and
`NEEDS_REVIEW`. Invalid output must not silently appear as fact.

## Graph analytics

- **Degree centrality:** identify referenced, depended-on, or connecting clauses
  and key definitions.
- **Density:** describe structural complexity, never direct legal risk.
- **Dependency depth:** return the depth, path nodes, clauses, and why the chain
  increases cognitive load.
- **Path finding:** support flows such as payment → late fee → cure → termination;
  delivery → acceptance → warranty; breach → indemnity → liability cap.
- **Cycles:** detect circular definitions, references, and conditional logic.
- **Orphans/leaves:** surface unused definitions, unresolved references,
  disconnected obligations, and terminal consequences.
- **Articulation points:** call them structurally critical, not invalid.
- **Connected components:** surface isolated or weakly connected subgraphs.

## Contract linter

Deterministic smells include long clauses, exact/near duplicates, undefined
capitalized terms, unused definitions, broken/circular references, high dependency
depth, orphaned entities, inconsistent values, and conflicting explicit deadlines.

AI-assisted smells include legalese, ambiguity, superfluous text, inconsistent
terminology, hidden obligations, vague standards, broad indemnity, one-sided
language, semantic contradiction, unclear exceptions, and weak triggers.

## Commercial risk

Interpret risk from the selected party's role. Review payment, refunds, liability,
indemnity, IP, confidentiality, termination, warranties, notice, exclusivity,
renewal, penalties, and disputes. A term may favor one party and expose another.
Label this commercial exposure, not legal invalidity.

## Legal-review layer

Internal graph analysis does not establish legality. Legal review requires
jurisdiction, contract type, role, counterparty type, effective date, issue type,
and current authoritative sources. The model must not invent law from memory.

Keep the MVP rule pack narrow—suggested focus: India SaaS/NDA signals for
governing law, disputes, confidentiality duration, post-termination duties,
payments/refunds, liability, indemnity, IP, termination, restraint/non-compete,
and missing context.

Allowed statuses are `NO_RULE_MATCH`, `POTENTIAL_CONFLICT`,
`POTENTIALLY_UNENFORCEABLE`, `REQUIRES_JURISDICTION_REVIEW`, and
`INSUFFICIENT_CONTEXT`. Every legal finding includes jurisdiction, issue, legal
basis, authoritative source and date, limitations, confidence, and a human-review
recommendation.

## Explainability output

Every finding presents the finding, why it matters, exact evidence, confidence,
supporting clauses, dependency path, source location, method, uncertainty, and a
next step. Show concise source-grounded reasoning summaries, never private
chain-of-thought.

## Comparison and negotiation

Compare contracts across:

- Clauses: added, removed, modified, unchanged
- Semantics: amounts, deadlines, law, actors, exceptions, caps
- Obligations/rights: added, removed, reassigned, changed consequence or deadline
- Graph: nodes/edges, paths, centrality, articulation points, and cycles

For a selected finding, negotiation output may include safer, balanced, and
simplified wording; a role-specific recommendation; business impact; trade-offs;
confidence; and linked evidence. Show original and proposed text with changes and
downstream impact. The MVP does not rewrite the source DOCX.