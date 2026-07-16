# Claux Agent Guide

Claux is a graph-native, explainable contract-intelligence workbench. It treats
contracts like software: parse structure, build a typed graph, lint for quality
issues, trace dependencies, and link every conclusion to source evidence.

## Task and commit workflow

Treat each requested feature as a sequence of small, independently verifiable
tasks. Never implement an entire multi-part feature in one change.

Before implementation:

1. Inspect the repository and relevant documentation.
2. Break the request into independently committable tasks.
3. Present the task breakdown when the request contains multiple tasks.
4. Do not combine unrelated refactoring, cleanup, or dependency upgrades with
   feature work.

For every task:

1. Implement only that task and its directly related files.
2. Add or update tests for the task.
3. Run the narrowest relevant tests.
4. Run type-check and lint when applicable.
5. Review the diff for correctness, architecture, security, performance, and
   accidental unrelated changes.
6. Commit the completed task before starting the next task.
7. Do not begin the next task if verification or the commit fails.

Each commit must:

- Leave the repository in a working state.
- Contain one logical change.
- Include implementation, tests, and directly related documentation.
- Exclude unrelated user changes and unrelated formatting.
- Follow Conventional Commits.
- Use an imperative, lowercase subject without a trailing period.
- Explain important reasoning in the commit body when it is not evident from
  the diff.

Allowed commit types:

- `feat`: new user-visible capability
- `fix`: bug fix
- `refactor`: restructuring without behavior changes
- `test`: test-only change
- `docs`: documentation-only change
- `style`: formatting or visual styling without behavior changes
- `chore`: tooling, configuration, or maintenance
- `perf`: performance improvement
- `build`: build-system or dependency change
- `ci`: continuous-integration change

Examples:

- `feat(ui): add button component`
- `test(ui): cover button interaction states`
- `fix(upload): reject encrypted PDF files`
- `refactor(graph): extract path traversal helpers`
- `docs(architecture): document workspace persistence`

If the working tree already contains user changes:

- Never include them in a commit unless the user explicitly requests it.
- Stage files explicitly; never use `git add .` or `git add -A`.
- Inspect `git status` and the staged diff before committing.
- Stop and report the conflict if the task cannot be separated safely.

Do not amend, squash, rebase, force-push, or rewrite existing commits unless the
user explicitly requests it.

## Non-negotiable principles

- Prefer source evidence over fluent explanation.
- Use AI for semantic language understanding; use deterministic TypeScript for
  validation, graph construction, metrics, paths, cycles, diffs, and thresholds.
- Never present unverified AI output as fact.
- Keep structural diagnostics, contract smells, commercial risks, legal-review
  signals, negotiation suggestions, and uncertainty distinct.
- Never claim a contract is legally safe or a clause is illegal without a
  current authoritative rule and sufficient legal context.
- Preserve contract text exactly. AI must never regenerate source clauses.
- Keep contract files browser-local and processing server-stateless. Never log
  full contract text or expose the OpenAI API key.

## MVP boundaries

Build a polished single-user browser workspace for one primary and one optional
comparison contract. Do not add authentication, teams, cloud/database storage,
e-signatures, approvals, billing, collaboration, queues, microservices, Neo4j,
universal legal research, OCR-heavy workflows, or production DOCX redlining.

## Preferred stack

- Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Lucide React
- Cytoscape.js with Dagre; CoSE-Bilkent only for optional exploration
- OpenAI Responses API with Structured Outputs; Zod validation
- PDF: `pdfjs-dist` or `unpdf`; DOCX: `mammoth`
- Dexie/IndexedDB for sessions; Zustand only for transient interaction state
- Framer Motion for restrained interaction feedback; Vercel deployment

## Working conventions

- Inspect the existing repository and nearby patterns before editing.
- Keep domain logic in feature/lib modules rather than React components.
- Define or update Zod schemas before consuming new AI output.
- Validate evidence before graph assembly or user-visible interpretation.
- Keep original document blobs only if exact rendering after refresh requires it.
- Preserve the current workspace when recoverable errors occur.
- Bundle a static, manually reviewed sample contract and expected analysis so the
  demo does not depend on a live model call.
- Run the narrowest relevant tests, then type-check and lint changed code.
- Do not expand scope merely because a future-roadmap feature is documented.

## Definition of done

A change is complete when its main path works, relevant failures are handled,
source/evidence links remain auditable, browser-local privacy is preserved, and
the relevant unit/integration tests pass. Report checks that could not be run.

## Read only what the task needs

- Product boundaries and positioning: `docs/product-overview.md`
- Stack, modules, API flow, and storage: `docs/architecture.md`
- Domain types, graph ontology, and API contracts: `docs/data-models.md`
- AI responsibilities, validation, analytics, and legal safety: `docs/analysis-engine.md`
- Screens, interactions, and visual language: `docs/ux-design.md`
- Performance, errors, testing, implementation, and demo: `docs/delivery.md`

For small tasks, do not read every document. Start with this file and the one
document most relevant to the requested change, then inspect code as needed.
