import { ClauseInspectorTabButton } from "../ClauseInspectorTabButton";
import { InspectorDependencies } from "../InspectorDependencies";
import { InspectorEvidence } from "../InspectorEvidence";
import { InspectorHistory } from "../InspectorHistory";
import { InspectorOverview } from "../InspectorOverview";
import type { ClauseInspectorProps } from "./types";
import { inspectorTabs } from "./types";

export function ClauseInspector({
  activeTab,
  inspector,
  onTabChange,
}: ClauseInspectorProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="mt-2 text-base font-semibold leading-6">
            {inspector.title}
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {inspector.clauseRef}
          </p>
        </div>
      </div>

      <div
        aria-label="Inspector tabs"
        className="mt-5 grid grid-cols-4 border-b border-border"
        role="tablist"
      >
        {inspectorTabs.map((tab) => (
          <ClauseInspectorTabButton
            active={activeTab === tab}
            key={tab}
            onClick={() => onTabChange(tab)}
            tab={tab}
          />
        ))}
      </div>

      <div className="mt-5">
        {activeTab === "summary" ? (
          <InspectorOverview inspector={inspector} />
        ) : null}
        {activeTab === "evidence" ? <InspectorEvidence inspector={inspector} /> : null}
        {activeTab === "dependencies" ? (
          <InspectorDependencies inspector={inspector} />
        ) : null}
        {activeTab === "history" ? <InspectorHistory inspector={inspector} /> : null}
      </div>
    </div>
  );
}
