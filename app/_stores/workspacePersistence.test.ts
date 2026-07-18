import assert from "node:assert/strict";
import test from "node:test";

import { toPersistedWorkspaceSession } from "./workspacePersistence.ts";

test("toPersistedWorkspaceSession preserves createdAt and updates changed fields", () => {
  const session = toPersistedWorkspaceSession(
    {
      analysis: null,
      analysisResponse: null,
      clauses: [],
      document: null,
      error: "Analysis failed.",
      jobStage: "failed",
      parties: [],
      reviewerRole: "received",
      uploadedFileName: "deal.txt",
    },
    new Date("2026-07-19T10:30:00.000Z"),
    "2026-07-18T10:30:00.000Z",
  );

  assert.equal(session.id, "primary");
  assert.equal(session.createdAt, "2026-07-18T10:30:00.000Z");
  assert.equal(session.updatedAt, "2026-07-19T10:30:00.000Z");
  assert.equal(session.uploadedFileName, "deal.txt");
  assert.equal(session.jobStage, "failed");
});
