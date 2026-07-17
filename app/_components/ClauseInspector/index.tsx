import { X } from "lucide-react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { labelClass, severityTone } from "../constants";
import { formatLabel } from "../format";
import { InspectorDependencies } from "../InspectorDependencies";
import { InspectorEvidence } from "../InspectorEvidence";
import { InspectorHistory } from "../InspectorHistory";
import { InspectorSummary } from "../InspectorSummary";
import type { ClauseInspectorProps, InspectorTab } from "./types";
import { inspectorTabs } from "./types";

export function ClauseInspector({
  activeTab,
  inspector,
  onClose,
  onTabChange,
}: ClauseInspectorProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Clause inspector
          </p>
          <h2 className="mt-2 text-base font-semibold leading-6">
            {inspector.title}
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {inspector.clauseRef}
          </p>
        </div>
        <Button
          icon={X}
          iconOnlyLabel="Close inspector"
          onClick={onClose}
          size="icon"
          variant="danger"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone="primary">{inspector.nodeType}</Badge>
        {inspector.severity ? (
          <Badge tone={severityTone[inspector.severity]}>
            {inspector.severity}
          </Badge>
        ) : null}
        <Badge>{Math.round(inspector.confidence * 100)}% confidence</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {inspector.labels.map((label) => (
          <span
            className={`rounded-sm border px-2 py-1 text-[11px] font-medium ${labelClass[label]}`}
            key={label}
          >
            {formatLabel(label)}
          </span>
        ))}
      </div>

      <div
        aria-label="Inspector tabs"
        className="mt-5 grid grid-cols-4 rounded-md border border-border bg-background p-1"
        role="tablist"
      >
        {inspectorTabs.map((tab) => (
          <TabButton
            active={activeTab === tab}
            key={tab}
            onClick={() => onTabChange(tab)}
            tab={tab}
          />
        ))}
      </div>

      <div className="mt-5">
        {activeTab === "summary" ? <InspectorSummary inspector={inspector} /> : null}
        {activeTab === "evidence" ? <InspectorEvidence inspector={inspector} /> : null}
        {activeTab === "dependencies" ? (
          <InspectorDependencies inspector={inspector} />
        ) : null}
        {activeTab === "history" ? <InspectorHistory inspector={inspector} /> : null}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  tab,
}: {
  active: boolean;
  onClick: () => void;
  tab: InspectorTab;
}) {
  return (
    <button
      aria-selected={active}
      className={`h-8 rounded-sm px-2 text-xs font-medium capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
        active
          ? "bg-surface-raised text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {tab}
    </button>
  );
}
