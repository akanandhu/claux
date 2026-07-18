import { ClauseVisualiser } from "../ClauseVisualiser";
import { findContractClause, findContractSection } from "@/features/demo/utils";
import { metricTone } from "../constants";
import type { DashboardMainProps } from "./types";
import { DashboardMetrics } from "../DashboardMetrics";
import { PlainEnglishExplanation } from "../PlainEnglishExplanation";

export function DashboardMain({
  activeClauseId,
  activeSectionId,
  analysis,
  onSelectClause,
  onSelectSection,
  outline,
  selectedInspector,
}: DashboardMainProps) {
  const activeClause = findContractClause(activeClauseId, outline);
  const activeSection = findContractSection(activeSectionId, outline);

  return (
    <div className="flex-1 space-y-4 p-4 lg:p-5">
      <DashboardMetrics
        dashboardMetrics={analysis.metrics}
        metricTone={metricTone}
      />
      <ClauseVisualiser
        activeClauseId={activeClauseId}
        activeSectionId={activeSectionId}
        onSelectClause={onSelectClause}
        onSelectSection={onSelectSection}
        outline={outline}
      />
      <PlainEnglishExplanation
        inspector={selectedInspector}
        selectedClause={activeClause}
        selectedSection={activeSection}
      />
    </div>
  );
}
