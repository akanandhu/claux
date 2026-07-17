import type { DemoDependency, DemoEvidence } from "../types";

export function evidence(
  id: string,
  clauseRef: string,
  page: number,
  excerpt: string,
  validationStatus: DemoEvidence["validationStatus"] = "VERIFIED",
): DemoEvidence {
  return { id, clauseRef, page, excerpt, validationStatus };
}

export function dependency(
  id: string,
  label: string,
  relationship: string,
  severity?: DemoDependency["severity"],
): DemoDependency {
  return { id, label, relationship, severity };
}
