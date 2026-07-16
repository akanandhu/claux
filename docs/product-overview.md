# Product Overview

## Identity

**Name:** Claux  
**Category:** Explainable, graph-native contract intelligence  
**Tagline:** Understand contracts structurally, not just semantically.

Claux converts legal agreements into structured clauses and entities, a typed
legal knowledge graph, deterministic diagnostics, contract smells, role-specific
commercial-risk explanations, source-linked evidence, dependency analysis,
optional version comparison, and negotiation suggestions.

The clearest positioning is:

> A graph-native contract intelligence engine that treats contracts like
> software: parsing their structure, linting them for quality issues, tracing
> dependencies, and making every AI conclusion auditable.

Useful analogies include ESLint/SonarQube for contract quality, VS Code Call
Hierarchy for dependencies, Git blame for provenance, Git diff for comparison,
and Neo4j Bloom adapted to legal exploration.

Do not call the MVP an “operating system for contracts.” It is an intelligence
engine and analysis workbench, not a complete CLM platform.

## User questions Claux must answer

- Who owes what to whom, under which condition, and by what date?
- Which clauses depend on this clause, and what changes if it is modified?
- Which definitions are missing, unused, duplicated, or circular?
- Why was something flagged, and what exact text supports the finding?
- Is the issue structural, commercial, legal, or uncertain?
- What could be negotiated differently?

## Product principles

1. **Explainability before automation.** Every fact, relationship, finding, or
   suggestion links to contract evidence.
2. **AI understands language; code measures structure.** Semantic extraction and
   explanation may use AI. Objective validation and graph analysis do not.
3. **Human-verifiable by design.** Show source clause, evidence text, confidence,
   supporting clauses, dependency path, method, uncertainty, and next step.
4. **No generic risk score.** Keep facts, diagnostics, smells, commercial risks,
   legal-review signals, negotiation suggestions, and uncertainty separate.
5. **No legal overclaiming.** “May create commercial exposure” is acceptable;
   “legally safe” is not.

## MVP scope

One browser-local workspace contains one primary contract and one optional
comparison contract. The product has no authentication, cloud account, database,
multi-user organization, or persistent server-side document storage. IndexedDB
stores the local workspace.

Supported input is PDF, DOCX, and TXT. Recommend a maximum of 30 pages. Reject
malformed/encrypted files and show an OCR-required state for scanned PDFs.

### Golden path

1. Upload a document and extract text with source locations.
2. Segment it into clauses and ask which party the user represents.
3. Extract legal entities and relationships with structured AI output.
4. Validate all AI evidence against the exact source text.
5. Build the typed graph and run deterministic analytics and linter rules.
6. Generate evidence-backed, role-specific commercial interpretations.
7. Explore dashboard, graph, inspector, smells, and dependency paths.
8. Optionally compare a second contract version across clauses, semantics,
   obligations, rights, and graph structure.
9. Optionally generate alternative wording for a selected finding.

A pre-analyzed NDA or SaaS agreement must be bundled for a reliable demo.

## Explicit non-goals

- Authentication, teams, billing, e-signatures, approvals, or collaboration
- Cloud repositories, server persistence, Redis, queues, NestJS, or microservices
- Neo4j or a presentation-only multi-agent architecture
- Universal legal advice or full jurisdiction-wide legal research
- Support for 100+ page contracts or OCR-heavy scanned documents
- Production DOCX redlining or an arbitrary universal health score

## Future roadmap, not current scope

Possible later work includes organizations, cloud repositories, multi-document
graphs, MSA/SOW/NDA relationship analysis, custom playbooks, jurisdiction packs,
lawyer-reviewed rules, redlining, approvals, audit logs, e-signatures, renewal
monitoring, an API, and CLM integrations.
