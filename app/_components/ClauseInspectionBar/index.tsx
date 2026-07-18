import {
  ArrowLeft,
  PanelRightClose,
  PanelRightOpen,
  ScrollText,
} from "lucide-react";

import { Button } from "@/components/Button";
import { ClauseInspector } from "../ClauseInspector";
import { ClauseInspectionBarBreadcrumb } from "../ClauseInspectionBarBreadcrumb";
import { ClauseRiskPanel } from "../ClauseRiskPanel";
import { ContractBrief } from "../ContractBrief";
import { SectionDetailPanel } from "../SectionDetailPanel";
import type { ClauseInspectionBarProps } from "./types";

export function ClauseInspectionBar({
  activeInspectorTab,
  canGoBack,
  clauseSelection,
  contractSummary,
  contractType,
  inspectorOpen,
  isOpen,
  onBack,
  onPreviewSection,
  onSelectClause,
  onShowSummary,
  outline,
  selectedInspector,
  selectedSection,
  setActiveInspectorTab,
  setInspectorOpen,
  setIsOpen,
  topFindings,
  view,
}: ClauseInspectionBarProps) {
  if (!isOpen) {
    return (
      <aside className="border-t border-border bg-surface/85 p-2 xl:sticky xl:top-0 xl:flex xl:h-screen xl:flex-col xl:items-center xl:border-l xl:border-t-0">
        <Button
          icon={PanelRightOpen}
          iconOnlyLabel="Expand clause inspection bar"
          onClick={() => setIsOpen(true)}
          size="icon"
        />
        <div className="mt-12 hidden rotate-90 whitespace-nowrap text-xs uppercase tracking-[0.18em] text-muted-foreground xl:block">
          Inspector
        </div>
      </aside>
    );
  }

  return (
    <aside className="border-t border-border bg-surface/85 px-4 py-5 xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto xl:border-l xl:border-t-0 xl:px-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <ClauseInspectionBarBreadcrumb
          clauseLabel={clauseSelection?.clause.label}
          onShowSummary={onShowSummary}
          onShowSection={() => {
            if (clauseSelection) {
              onPreviewSection(clauseSelection.section.id);
            }
          }}
          sectionLabel={selectedSection?.label ?? clauseSelection?.section.label}
          view={view}
        />
        <div className="flex items-center gap-2">
          {view === "inspector" ? (
            <>
              <Button
                disabled={!canGoBack}
                icon={ArrowLeft}
                iconOnlyLabel="Previous selected clause"
                onClick={onBack}
                size="icon"
              />
              <Button
                icon={ScrollText}
                iconOnlyLabel="Contract summary"
                onClick={onShowSummary}
                size="icon"
              />
            </>
          ) : null}
          <Button
            icon={PanelRightClose}
            iconOnlyLabel="Collapse clause inspection bar"
            onClick={() => setIsOpen(false)}
            size="icon"
          />
        </div>
      </div>
      {view === "summary" ? (
        <ContractBrief
          contractSummary={contractSummary}
          contractType={contractType}
          onPreviewSection={onPreviewSection}
          outline={outline}
          selectedSection={selectedSection}
          topFindings={topFindings}
        />
      ) : null}
      {view === "section" && selectedSection ? (
        <SectionDetailPanel
          onSelectClause={onSelectClause}
          section={selectedSection}
        />
      ) : null}
      {view === "clause" && clauseSelection ? (
        <ClauseRiskPanel
          clause={clauseSelection.clause}
          sectionLabel={clauseSelection.section.label}
        />
      ) : null}
      {view === "inspector" && inspectorOpen ? (
        <ClauseInspector
          activeTab={activeInspectorTab}
          inspector={selectedInspector}
          onTabChange={setActiveInspectorTab}
        />
      ) : null}
      {view === "inspector" && !inspectorOpen ? (
        <div className="rounded-md border border-border bg-background/55 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Inspector
          </p>
          <Button className="mt-3" onClick={() => setInspectorOpen(true)}>
            Open selected clause
          </Button>
        </div>
      ) : null}
    </aside>
  );
}
