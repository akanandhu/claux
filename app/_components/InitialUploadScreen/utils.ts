import type { JobStage } from "../WorkspaceShell/types";

export function isBusyStage(stage: JobStage) {
  return [
    "validating",
    "extracting",
    "segmenting",
    "analyzing",
    "verifying",
    "scoring",
    "building_view",
  ].includes(stage);
}

export function jobStageLabel(stage: JobStage) {
  const labels: Record<JobStage, string> = {
    analyzing: "Analyzing clauses",
    building_view: "Building workspace",
    completed: "Completed",
    extracting: "Extracting text locally",
    failed: "Failed",
    idle: "Ready",
    partial: "Partial analysis ready",
    scoring: "Scoring role-aware risk",
    segmenting: "Detecting clauses",
    validating: "Validating file",
    verifying: "Verifying evidence",
  };

  return labels[stage];
}
