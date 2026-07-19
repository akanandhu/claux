import type { JobStage } from "../WorkspaceShell/types";

export function isBusyStage(stage: JobStage) {
  return [
    "validating",
    "extracting",
    "segmenting",
    "submitting_analysis",
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
    submitting_analysis: "Sending clauses",
    validating: "Validating file",
    verifying: "Verifying evidence",
  };

  return labels[stage];
}

export function jobStageDescription(stage: JobStage, elapsedSeconds = 0) {
  if (stage === "analyzing") {
    if (elapsedSeconds >= 45) {
      return "Claux is still analyzing the source clauses and checking the contract structure. Keep this tab open.";
    }

    if (elapsedSeconds >= 20) {
      return "Claux is analyzing clause relationships, parties, evidence, and role-aware risk signals.";
    }

    return "Claux is analyzing the source clauses. Larger contracts can take a little longer.";
  }

  const descriptions: Record<JobStage, string> = {
    analyzing: "Claux is analyzing the source clauses.",
    building_view: "Preparing the graph, metrics, findings, and inspector views.",
    completed: "Analysis completed.",
    extracting: "Reading text locally from the selected file.",
    failed: "Analysis stopped before a workspace could be opened.",
    idle: "Ready for upload.",
    partial: "Analysis is available, but the reviewing party needs confirmation.",
    scoring: "Calculating deterministic review metrics.",
    segmenting: "Mapping source text into clause-like blocks with offsets.",
    submitting_analysis: "Uploading extracted clauses to the stateless analysis route.",
    validating: "Checking file type, size, and contract-like text signals.",
    verifying: "Checking model evidence against the extracted source clauses.",
  };

  return descriptions[stage];
}
