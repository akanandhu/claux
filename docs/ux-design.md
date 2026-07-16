# UX and Visual Design

## Product character

Claux should feel like a dark-first enterprise developer tool influenced by
Linear, GitHub, Cursor, Vercel, and Neo4j Bloom. It is dense but readable,
evidence-first, and restrained—not a generic chatbot or decorative legal-themed
dashboard.

| Role | Color |
|---|---|
| Background | `#0B1220` |
| Surface | `#111827` |
| Border | `#1F2937` |
| Primary | `#2563EB` |
| AI accent | `#7C3AED` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |
| Secondary text | `#94A3B8` |

Use clear spacing, rounded cards, restrained shadows, minimal gradients,
semantic colors, and monospace for source evidence. Avoid excessive glow, 3D
graphs, legal clichés, and dashboards that obscure provenance.

## Core screens

### Upload

Show the name and value proposition, drag/drop input, supported formats, a sample
NDA/SaaS agreement, recent local analysis, and clear slot-replacement behavior.

### Processing

Show truthful stages: extracting, segmenting clauses, identifying parties,
building graph, running diagnostics, mapping evidence, and generating explanations.

### Dashboard

Use separate metrics: evidence coverage, extraction confidence, structural
complexity, critical dependencies, contract smells, role-specific commercial
risks, and unresolved findings. Do not collapse these into one health score.

### Knowledge graph

Default to hierarchical Dagre. Include type legends, zoom/pan, search, useful
filters, optional minimap, “My obligations,” and shortcuts for payment,
termination, confidentiality, and IP paths.

On hover, subtly enlarge the node, fade unrelated nodes, and emphasize connected
edges. On click, open the inspector, highlight exact evidence, expose dependencies,
and enable impact tracing.

### Clause inspector

Show number/title, finding badge, summary, role-specific impact, confidence,
exact evidence, page/section, supporting clauses, dependencies, provenance,
uncertainty, and suggested action.

### Contract smells

Use a SonarQube-inspired severity grouping. Each item includes type, clauses,
reason, evidence, and a quick fix or review suggestion.

### Dependency explorer

Use a Call Hierarchy-inspired view with: depends on, referenced by, downstream
impact, critical path, and shortest path modes.

### Explainability

Expose evidence coverage, verified/unverified findings, missing sources, average
confidence, and source-linked graph paths.

### Negotiation

Use a split view for original and proposed text, highlighted changes,
risk/trade-off explanation, downstream dependencies, and copy/regenerate actions.

### Version comparison

Present clause, semantic, obligation, graph, and commercial-risk changes. It
should feel like Git diff for contracts.

## Interaction state

Zustand may own `selectedNodeId`, `hoveredNodeId`, `activeFilters`,
`highlightedPath`, `inspectorOpen`, `reasoningMode`, and `activeContractSlot`.
Persistent document/analysis data remains in Dexie. 