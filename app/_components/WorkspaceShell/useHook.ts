import { useEffect, useMemo, useState } from "react";

import { buildLiveAnalysisFixture } from "@/features/analysis/fixture-adapter";
import {
  analysisLimitMessage,
  useAnalysisLimiterStore,
} from "@/app/_stores/analysisLimiter";
import { useWorkspacePersistenceStore } from "@/app/_stores/workspacePersistence";
import type { DemoAnalysisFixture } from "@/features/demo/types";
import { extractContractDocument } from "@/features/ingestion/extract";
import { segmentContractClauses } from "@/features/ingestion/segment";
import type {
  AnalyzeResponse,
  ContractClause,
  ParsedDocument,
  ReviewerContext,
} from "@/schemas/contract";
import type { InspectorTab } from "../ClauseInspector/types";
import { contractOutline } from "@/features/demo/fixture/outline";
import { findContractClause, findContractSection } from "@/features/demo/utils";
import type {
  ClauseInspectionBarView,
  LiveJob,
  ReviewerRole,
  WorkspaceShellProps,
} from "./types";
import { errorMessage, postJson, yieldToPaint } from "./utils";

const analysisTimeoutMs = 90_000;

export function useWorkspaceSelection(analysis: DemoAnalysisFixture) {
  const [selectedInspectorState, setSelectedInspectorState] = useState({
    analysisDefaultInspectorId: analysis.defaultInspectorId,
    selectedInspectorId: analysis.defaultInspectorId,
  });
  const [activeInspectorTab, setActiveInspectorTab] =
    useState<InspectorTab>("summary");
  const [inspectorOpen, setInspectorOpen] = useState(true);

  const selectedInspectorId =
    selectedInspectorState.analysisDefaultInspectorId === analysis.defaultInspectorId
      ? selectedInspectorState.selectedInspectorId
      : analysis.defaultInspectorId;

  const selectedInspector =
    analysis.inspectors.find(
      (inspector) => inspector.id === selectedInspectorId,
    ) ?? analysis.inspectors[0];

  function selectInspector(inspectorId: string) {
    setSelectedInspectorState({
      analysisDefaultInspectorId: analysis.defaultInspectorId,
      selectedInspectorId: inspectorId,
    });
    setActiveInspectorTab("summary");
    setInspectorOpen(true);
  }

  return {
    activeInspectorTab,
    inspectorOpen,
    selectedInspector,
    selectedNodeId: selectedInspector.nodeId,
    selectInspector,
    setActiveInspectorTab,
    setInspectorOpen,
  };
}

export function useWorkspaceShellState(initialAnalysis: WorkspaceShellProps["analysis"]) {
  const consumeAnalysis = useAnalysisLimiterStore((state) => state.consumeAnalysis);
  const clearPersistedSession = useWorkspacePersistenceStore(
    (state) => state.clearSession,
  );
  const hydratePersistedSession = useWorkspacePersistenceStore(
    (state) => state.hydrateLatest,
  );
  const persistenceHydrated = useWorkspacePersistenceStore(
    (state) => state.hydrated,
  );
  const persistedSession = useWorkspacePersistenceStore((state) => state.session);
  const savePersistedSession = useWorkspacePersistenceStore(
    (state) => state.saveSession,
  );
  const [liveAnalysis, setLiveAnalysis] =
    useState<WorkspaceShellProps["analysis"] | null>(null);
  const activeAnalysis = liveAnalysis ?? initialAnalysis;
  const outline = useMemo(
    () => activeAnalysis.outline ?? contractOutline,
    [activeAnalysis],
  );
  const [reviewerRole, setReviewerRole] = useState<ReviewerRole>("received");
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const [job, setJob] = useState<LiveJob>({
    clauses: [],
    document: null,
    error: null,
    parties: [],
    startedAt: null,
    stage: "idle",
  });
  const [inspectorHistory, setInspectorHistory] = useState<string[]>([]);
  const [activeClauseId, setActiveClauseId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [clauseInspectionBarSectionId, setClauseInspectionBarSectionId] = useState<string | null>(
    null,
  );
  const [clauseInspectionBarOpen, setClauseInspectionBarOpen] = useState(true);
  const [clauseInspectionBarView, setClauseInspectionBarView] =
    useState<ClauseInspectionBarView>("summary");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [restoredSessionId, setRestoredSessionId] = useState<string | null>(null);
  const selection = useWorkspaceSelection(activeAnalysis);

  useEffect(() => {
    void hydratePersistedSession();
  }, [hydratePersistedSession]);

  useEffect(() => {
    if (
      !persistenceHydrated ||
      !persistedSession ||
      restoredSessionId === persistedSession.id
    ) {
      return;
    }

    const restoreId = window.setTimeout(() => {
      setUploadedFileName(persistedSession.uploadedFileName);
      setReviewerRole(persistedSession.reviewerRole);
      setLiveAnalysis(persistedSession.analysis);
      setWorkspaceReady(
        Boolean(persistedSession.analysis) &&
          ["completed", "partial"].includes(persistedSession.jobStage),
      );
      setJob({
        clauses: persistedSession.clauses,
        document: persistedSession.document,
        error: persistedSession.error,
        parties: persistedSession.parties,
        startedAt: null,
        stage: persistedSession.jobStage,
      });
      setRestoredSessionId(persistedSession.id);
    }, 0);

    return () => window.clearTimeout(restoreId);
  }, [persistedSession, persistenceHydrated, restoredSessionId]);

  async function handleUpload(file: File) {
    const uploadStartedAt = Date.now();

    setUploadedFileName(file.name);
    setWorkspaceReady(false);
    setLiveAnalysis(null);
    setActiveClauseId(null);
    setActiveSectionId(null);
    setClauseInspectionBarSectionId(null);
    setClauseInspectionBarView("summary");

    try {
      setJob({
        clauses: [],
        document: null,
        error: null,
        parties: [],
        startedAt: uploadStartedAt,
        stage: "validating",
      });
      await yieldToPaint();
      setJob((current) => ({ ...current, stage: "extracting" }));
      const document = await extractContractDocument(file);

      setJob((current) => ({ ...current, document, stage: "segmenting" }));
      await yieldToPaint();
      const clauses = segmentContractClauses(document);
      const limitResult = consumeAnalysis();

      if (!limitResult.allowed) {
        await savePersistedSession({
          analysis: null,
          analysisResponse: null,
          clauses,
          document,
          error: analysisLimitMessage(limitResult),
          jobStage: "failed",
          parties: [],
          reviewerRole,
          uploadedFileName: file.name,
        });
        setJob({
          clauses,
          document,
          error: analysisLimitMessage(limitResult),
          parties: [],
          startedAt: uploadStartedAt,
          stage: "failed",
        });
        return;
      }

      await analyzeLiveContract({
        clauses,
        document,
        reviewerContext: {
          relationship: reviewerRole,
          status: "unresolved",
        },
      });
    } catch (error) {
      setJob({
        clauses: [],
        document: null,
        error: errorMessage(error),
        parties: [],
        startedAt: uploadStartedAt,
        stage: "failed",
      });
    }
  }

  function openDemoWorkspace() {
    void clearPersistedSession();
    setLiveAnalysis(null);
    setUploadedFileName(null);
    setJob({
      clauses: [],
      document: null,
      error: null,
      parties: [],
      startedAt: null,
      stage: "idle",
    });
    setWorkspaceReady(true);
  }

  function handleSelectSection(sectionId: string) {
    setActiveSectionId(sectionId);
    setClauseInspectionBarSectionId(sectionId);
    setActiveClauseId(null);
    setClauseInspectionBarOpen(true);
    setClauseInspectionBarView("section");
  }

  function handleSelectClause(clauseId: string, sectionId: string) {
    setActiveClauseId(clauseId);
    setActiveSectionId(sectionId);
    setClauseInspectionBarSectionId(sectionId);
    setClauseInspectionBarOpen(true);
    setClauseInspectionBarView("clause");
  }

  function previewSection(sectionId: string) {
    setActiveSectionId(sectionId);
    setClauseInspectionBarSectionId(sectionId);
    setActiveClauseId(null);
    setClauseInspectionBarOpen(true);
    setClauseInspectionBarView("section");
  }

  function showContractSummary() {
    setClauseInspectionBarView("summary");
    setInspectorHistory([]);
    setActiveClauseId(null);
    setActiveSectionId(null);
    setClauseInspectionBarSectionId(null);
  }

  function showPreviousInspector() {
    const previousInspectorId = inspectorHistory.at(-1);

    if (!previousInspectorId) {
      showContractSummary();
      return;
    }

    setInspectorHistory((history) => history.slice(0, -1));
    setClauseInspectionBarView("inspector");
    selection.setInspectorOpen(true);
    selection.selectInspector(previousInspectorId);
  }

  async function analyzeLiveContract({
    clauses,
    document,
    reviewerContext,
  }: {
    clauses: ContractClause[];
    document: ParsedDocument;
    reviewerContext: ReviewerContext;
  }) {
    try {
      setJob((current) => ({
        ...current,
        clauses,
        document,
        error: null,
        stage: "submitting_analysis",
      }));
      await yieldToPaint();
      setJob((current) => ({ ...current, stage: "analyzing" }));
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), analysisTimeoutMs);
      const analysisResponse = await postJson<AnalyzeResponse>(
        "/api/analyze",
        {
          clauses,
          reviewerContext,
        },
        { signal: controller.signal },
      ).catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new Error(
            "Analysis took too long. Your extracted clauses were kept locally; try again with a shorter contract or retry later.",
          );
        }

        throw error;
      }).finally(() => {
        window.clearTimeout(timeoutId);
      });
      setJob((current) => ({ ...current, stage: "verifying" }));
      await yieldToPaint();

      setJob((current) => ({ ...current, stage: "building_view" }));
      const effectiveReviewerContext: ReviewerContext = {
        relationship: reviewerContext.relationship,
        reviewingPartyId: analysisResponse.inferredReviewingParty?.id,
        reviewingPartyName:
          analysisResponse.inferredReviewingParty?.role ??
          analysisResponse.inferredReviewingParty?.name,
        status: analysisResponse.inferredReviewingParty
          ? "confirmed"
          : analysisResponse.requiresClarification
            ? "requires_confirmation"
            : "unresolved",
      };
      const nextAnalysis = buildLiveAnalysisFixture({
        analysisResult: analysisResponse,
        clauses,
        document,
        reviewerContext: effectiveReviewerContext,
      });
      const nextJobStage = analysisResponse.requiresClarification
        ? "partial"
        : "completed";

      setLiveAnalysis(nextAnalysis);
      setWorkspaceReady(true);
      setJob((current) => ({
        ...current,
        parties: analysisResponse.identifiedParties,
        error: null,
        stage: nextJobStage,
      }));
      await savePersistedSession({
        analysis: nextAnalysis,
        analysisResponse,
        clauses,
        document,
        error: null,
        jobStage: nextJobStage,
        parties: analysisResponse.identifiedParties,
        reviewerRole,
        uploadedFileName: document.fileName,
      });
    } catch (error) {
      setWorkspaceReady(false);
      setLiveAnalysis(null);
      await savePersistedSession({
        analysis: null,
        analysisResponse: null,
        clauses,
        document,
        error: errorMessage(error),
        jobStage: "failed",
        parties: [],
        reviewerRole,
        uploadedFileName: document.fileName,
      });
      setJob((current) => ({
        ...current,
        error: errorMessage(error),
        stage: "failed",
      }));
    }
  }

  return {
    activeAnalysis,
    activeClauseId,
    activeSectionId,
    handleUpload,
    handleSelectClause,
    handleSelectSection,
    job,
    openDemoWorkspace,
    outline,
    previewSection,
    reviewerRole,
    clauseInspectionBar: {
      activeInspectorTab: selection.activeInspectorTab,
      canGoBack: inspectorHistory.length > 0,
      clauseSelection: findContractClause(activeClauseId, outline),
      inspectorOpen: selection.inspectorOpen,
      isOpen: clauseInspectionBarOpen,
      selectedInspector: selection.selectedInspector,
      selectedSection: findContractSection(clauseInspectionBarSectionId, outline),
      setActiveInspectorTab: selection.setActiveInspectorTab,
      setInspectorOpen: selection.setInspectorOpen,
      setIsOpen: setClauseInspectionBarOpen,
      view: clauseInspectionBarView,
    },
    selectedInspector: selection.selectedInspector,
    selectedNodeId: selection.selectedNodeId,
    setReviewerRole,
    clearWorkspace: () => {
      void clearPersistedSession();
      setLiveAnalysis(null);
      setUploadedFileName(null);
      setWorkspaceReady(false);
      setJob({
        clauses: [],
        document: null,
        error: null,
        parties: [],
        startedAt: null,
        stage: "idle",
      });
    },
    showContractSummary,
    showPreviousInspector,
    uploadedFileName,
    workspaceReady,
  };
}
