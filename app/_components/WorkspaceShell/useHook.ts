import { useMemo, useState } from "react";

import { buildLiveAnalysisFixture } from "@/features/analysis/fixture-adapter";
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
  const selection = useWorkspaceSelection(activeAnalysis);

  async function handleUpload(file: File) {
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
        stage: "validating",
      });
      await yieldToPaint();
      setJob((current) => ({ ...current, stage: "extracting" }));
      const document = await extractContractDocument(file);

      setJob((current) => ({ ...current, document, stage: "segmenting" }));
      await yieldToPaint();
      const clauses = segmentContractClauses(document);

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
        stage: "failed",
      });
    }
  }

  function openDemoWorkspace() {
    setLiveAnalysis(null);
    setUploadedFileName(null);
    setJob({
      clauses: [],
      document: null,
      error: null,
      parties: [],
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
        stage: "analyzing",
      }));
      const analysisResponse = await postJson<AnalyzeResponse>("/api/analyze", {
        clauses,
        reviewerContext,
      });
      setJob((current) => ({ ...current, stage: "verifying" }));
      await yieldToPaint();

      setJob((current) => ({ ...current, stage: "building_view" }));
      setLiveAnalysis(
        buildLiveAnalysisFixture({
          analysisResult: analysisResponse,
          clauses,
          document,
          reviewerContext: {
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
          },
        }),
      );
      setWorkspaceReady(true);
      setJob((current) => ({
        ...current,
        parties: analysisResponse.identifiedParties,
        error: null,
        stage: analysisResponse.requiresClarification ? "partial" : "completed",
      }));
    } catch (error) {
      setWorkspaceReady(false);
      setLiveAnalysis(null);
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
    showContractSummary,
    showPreviousInspector,
    uploadedFileName,
    workspaceReady,
  };
}
