"use client";

import Dexie, { type Table } from "dexie";
import { create } from "zustand";

import type { DemoAnalysisFixture } from "@/features/demo/types";
import type {
  AnalyzeResponse,
  ContractClause,
  ParsedDocument,
  Party,
} from "@/schemas/contract";
import type {
  JobStage,
  ReviewerRole,
} from "../_components/WorkspaceShell/types";

const workspaceSessionId = "primary";

export type PersistedWorkspaceSession = {
  id: string;
  analysis: DemoAnalysisFixture | null;
  analysisResponse: AnalyzeResponse | null;
  clauses: ContractClause[];
  createdAt: string;
  document: ParsedDocument | null;
  error: string | null;
  jobStage: JobStage;
  parties: Party[];
  reviewerRole: ReviewerRole;
  updatedAt: string;
  uploadedFileName: string | null;
};

type PersistedWorkspaceInput = Omit<
  PersistedWorkspaceSession,
  "createdAt" | "id" | "updatedAt"
>;

type WorkspacePersistenceState = {
  hydrated: boolean;
  session: PersistedWorkspaceSession | null;
  clearSession: () => Promise<void>;
  hydrateLatest: () => Promise<void>;
  saveSession: (input: PersistedWorkspaceInput) => Promise<void>;
};

class ClauxWorkspaceDb extends Dexie {
  sessions!: Table<PersistedWorkspaceSession, string>;

  constructor() {
    super("claux-workspace");
    this.version(1).stores({
      sessions: "id, updatedAt",
    });
  }
}

let workspaceDb: ClauxWorkspaceDb | null = null;

export const useWorkspacePersistenceStore = create<WorkspacePersistenceState>()(
  (set, get) => ({
    hydrated: false,
    session: null,
    clearSession: async () => {
      const db = getWorkspaceDb();

      if (db) {
        await db.sessions.clear();
      }

      set({ hydrated: true, session: null });
    },
    hydrateLatest: async () => {
      const db = getWorkspaceDb();

      if (!db) {
        set({ hydrated: true, session: null });
        return;
      }

      const session = (await db.sessions.orderBy("updatedAt").last()) ?? null;
      set({ hydrated: true, session });
    },
    saveSession: async (input) => {
      const session = toPersistedWorkspaceSession(
        input,
        new Date(),
        get().session?.createdAt,
      );
      const db = getWorkspaceDb();

      if (db) {
        await db.sessions.put(session);
      }

      set({ hydrated: true, session });
    },
  }),
);

export function toPersistedWorkspaceSession(
  input: PersistedWorkspaceInput,
  now: Date,
  createdAt = now.toISOString(),
): PersistedWorkspaceSession {
  return {
    ...input,
    createdAt,
    id: workspaceSessionId,
    updatedAt: now.toISOString(),
  };
}

function getWorkspaceDb() {
  if (typeof indexedDB === "undefined") return null;

  workspaceDb ??= new ClauxWorkspaceDb();

  return workspaceDb;
}
