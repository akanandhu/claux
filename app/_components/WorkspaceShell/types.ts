import type { DemoAnalysisFixture } from "@/features/demo/types";
import type { ContractClause, ParsedDocument, Party } from "@/schemas/contract";

export type WorkspaceShellProps = {
  analysis: DemoAnalysisFixture;
};

export type ReviewerRole = "received" | "prepared";

export type ClauseInspectionBarView =
  | "summary"
  | "section"
  | "clause"
  | "inspector";

export type JobStage =
  | "idle"
  | "validating"
  | "extracting"
  | "segmenting"
  | "submitting_analysis"
  | "analyzing"
  | "verifying"
  | "scoring"
  | "building_view"
  | "completed"
  | "partial"
  | "failed";

export type LiveJob = {
  clauses: ContractClause[];
  document: ParsedDocument | null;
  error: string | null;
  parties: Party[];
  startedAt: number | null;
  stage: JobStage;
};
