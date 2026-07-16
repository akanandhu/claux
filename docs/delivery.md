# Delivery, Quality, and Demo

## Error handling

Handle unsupported, encrypted, malformed, scanned, or empty documents; failed
segmentation; missing party/law; AI timeout or malformed structured output;
evidence mismatch; unresolved references; low confidence; duplicate aliases;
dense or relationship-poor graphs; unrelated comparison files; renumbered clauses;
storage quota limits; and API rate limits.

Errors should preserve the existing local workspace whenever possible and explain
what the user can do next.

## Performance targets

- The initial screen is interactive immediately.
- Extraction and analysis display meaningful progress.
- The graph remains usable around 100–300 nodes.
- Expensive layouts run off the critical render path.
- Analysis stages may stream even if final structured output does not.
- The local workspace restores after refresh.
- The static sample loads immediately.

## Test strategy

Unit-test normalization, evidence matching, graph creation, metrics, cycles,
paths, orphans, diffs, and deterministic smells.

Integration-test upload → parse → clauses, clauses → AI schema, schema → graph,
finding → evidence inspector, and primary + comparison → diff.

Maintain a manually reviewed golden fixture with expected clauses, entities,
graph, findings, evidence, and a comparison fixture. The demo must fall back to
this fixture if the live model fails.

## Recommended implementation order

1. Set up Next.js, Tailwind, and shadcn/ui.
2. Build upload, local workspace, and the static sample fixture.
3. Implement parsing and deterministic clause segmentation.
4. Define Zod extraction schemas and `/api/analyze`.
5. Validate evidence, then build graph data and Cytoscape rendering.
6. Build the clause/evidence inspector.
7. Add deterministic graph analytics and contract smells.
8. Add role-specific interpretation and negotiation suggestions.
9. Add the optional comparison slot, semantic diff, and graph diff.
10. Add narrow legal-review signals only if time remains.

## Hackathon demo

1. Load the sample agreement.
2. Show meaningful “building contract intelligence” progress.
3. Reveal separate dashboard metrics.
4. Open the graph and select a high-impact clause.
5. Highlight its dependency chain and exact source evidence.
6. Explain why it matters for the selected party.
7. Generate a negotiation suggestion.
8. Load Version B and show changed obligations and dependencies.

The defining moment is that Claux does not merely label a clause risky: it shows
the evidence, dependent clauses, and how a change affects the agreement.

## Final release rule

When trade-offs arise, choose source evidence over fluency, deterministic
computation over AI estimation, explicit uncertainty over false confidence, a
small reliable feature over a broad unreliable claim, and one polished workflow
over many incomplete screens.