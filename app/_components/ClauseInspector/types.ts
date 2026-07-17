import type { DemoInspector } from "@/features/demo/types";

export const inspectorTabs = [
  "summary",
  "evidence",
  "dependencies",
  "history",
] as const;

export type InspectorTab = (typeof inspectorTabs)[number];

export type ClauseInspectorProps = {
  activeTab: InspectorTab;
  inspector: DemoInspector;
  onClose: () => void;
  onTabChange: (tab: InspectorTab) => void;
};
