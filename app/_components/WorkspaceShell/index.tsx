"use client";

import { DashboardMain } from "../DashboardMain";
import { ClauseInspectionBar } from "../ClauseInspectionBar";
import { InitialUploadScreen } from "../InitialUploadScreen";
import { PartyConfirmationScreen } from "../PartyConfirmationScreen";
import { Sidebar } from "../Sidebar";
import { TopBar } from "../TopBar";
import { reviewerRoleLabels } from "./constants";
import type { WorkspaceShellProps } from "./types";
import { useWorkspaceShellState } from "./useHook";

export function WorkspaceShell({ analysis }: WorkspaceShellProps) {
  const workspace = useWorkspaceShellState(analysis);

  if (!workspace.workspaceReady) {
    if (
      workspace.job.stage === "resolving_role" &&
      workspace.job.document
    ) {
      return (
        <PartyConfirmationScreen
          fileName={workspace.job.document.fileName}
          onConfirm={workspace.confirmReviewingParty}
          parties={workspace.job.parties}
          reviewerRole={workspace.reviewerRole}
        />
      );
    }

    return (
      <InitialUploadScreen
        error={workspace.job.error}
        jobStage={workspace.job.stage}
        onOpenDemo={workspace.openDemoWorkspace}
        onRoleChange={workspace.setReviewerRole}
        onUpload={workspace.handleUpload}
        reviewerRole={workspace.reviewerRole}
        uploadedFileName={workspace.uploadedFileName}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div
        className={`grid min-h-screen grid-cols-1 ${
          workspace.clauseInspectionBar.isOpen
            ? "xl:grid-cols-[18rem_minmax(0,1fr)_22rem]"
            : "xl:grid-cols-[18rem_minmax(0,1fr)_4rem]"
        }`}
      >
        <Sidebar
          activeClauseId={workspace.activeClauseId}
          activeSectionId={workspace.activeSectionId}
          analysis={workspace.activeAnalysis}
          contractFileName={
            workspace.uploadedFileName ?? workspace.activeAnalysis.contract.fileName
          }
          onSelectClause={workspace.handleSelectClause}
          onSelectSection={workspace.handleSelectSection}
          outline={workspace.outline}
          reviewerRoleLabel={reviewerRoleLabels[workspace.reviewerRole]}
        />
        <section className="flex min-w-0 flex-col">
          <div className="sticky top-0 z-20">
            <TopBar contract={workspace.activeAnalysis.contract} />
          </div>
          <DashboardMain
            activeClauseId={workspace.activeClauseId}
            activeSectionId={workspace.activeSectionId}
            analysis={workspace.activeAnalysis}
            onSelectClause={workspace.handleSelectClause}
            onSelectSection={workspace.handleSelectSection}
            outline={workspace.outline}
            selectedInspector={workspace.selectedInspector}
            selectedNodeId={workspace.selectedNodeId}
          />
        </section>
        <ClauseInspectionBar
          activeInspectorTab={workspace.clauseInspectionBar.activeInspectorTab}
          canGoBack={workspace.clauseInspectionBar.canGoBack}
          clauseSelection={workspace.clauseInspectionBar.clauseSelection}
          contractSummary={workspace.activeAnalysis.executiveSummary}
          contractType={workspace.activeAnalysis.contract.contractType}
          inspectorOpen={workspace.clauseInspectionBar.inspectorOpen}
          isOpen={workspace.clauseInspectionBar.isOpen}
          onBack={workspace.showPreviousInspector}
          onPreviewSection={workspace.previewSection}
          onSelectClause={workspace.handleSelectClause}
          onShowSummary={workspace.showContractSummary}
          onViewSectionFlow={workspace.viewSectionFlow}
          outline={workspace.outline}
          selectedInspector={workspace.clauseInspectionBar.selectedInspector}
          selectedSection={workspace.clauseInspectionBar.selectedSection}
          setActiveInspectorTab={workspace.clauseInspectionBar.setActiveInspectorTab}
          setInspectorOpen={workspace.clauseInspectionBar.setInspectorOpen}
          setIsOpen={workspace.clauseInspectionBar.setIsOpen}
          topFindings={workspace.activeAnalysis.topFindings}
          view={workspace.clauseInspectionBar.view}
        />
      </div>
    </main>
  );
}
