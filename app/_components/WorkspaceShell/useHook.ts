import { useState } from "react";

import type { DemoAnalysisFixture } from "@/features/demo/types";
import type { InspectorTab } from "../ClauseInspector/types";

export function useWorkspaceSelection(analysis: DemoAnalysisFixture) {
  const [selectedInspectorId, setSelectedInspectorId] = useState(
    analysis.defaultInspectorId,
  );
  const [activeInspectorTab, setActiveInspectorTab] =
    useState<InspectorTab>("summary");
  const [inspectorOpen, setInspectorOpen] = useState(true);

  const selectedInspector =
    analysis.inspectors.find(
      (inspector) => inspector.id === selectedInspectorId,
    ) ?? analysis.inspectors[0];

  function selectInspector(inspectorId: string) {
    setSelectedInspectorId(inspectorId);
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
