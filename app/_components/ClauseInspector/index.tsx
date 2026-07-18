import { AlertCircle, CheckCircle2, GitBranch, Link2 } from "lucide-react";

import { Badge } from "@/components/Badge";
import type { BadgeTone } from "@/components/Badge/types";
import { Button } from "@/components/Button";
import { severityTone } from "../constants";
import { formatLabel } from "../format";
import { InspectorDependencies } from "../InspectorDependencies";
import { InspectorEvidence } from "../InspectorEvidence";
import { InspectorHistory } from "../InspectorHistory";
import type { ClauseInspectorProps, InspectorTab } from "./types";
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
          <TabButton
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
      className={`h-9 border-b-2 px-2 text-xs font-medium capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {tab === "dependencies" ? "impact" : tab}
    </button>
  );
}

function InspectorOverview({
  inspector,
}: {
  inspector: ClauseInspectorProps["inspector"];
}) {
  const condition = inspector.dependencyChain.find((dependency) =>
    dependency.relationship.toLowerCase().includes("condition"),
  );
  const consequence = inspector.dependencyChain.find((dependency) =>
    dependency.relationship.toLowerCase().includes("impact"),
  );

  return (
    <div className="space-y-4">
      <section>
        <h3 className="text-sm font-medium">In simple terms</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {inspector.summary}
        </p>
      </section>

      <dl className="grid grid-cols-3 gap-2">
        <InspectorStat label="Type" value={formatLabel(inspector.nodeType)} />
        <InspectorStat
          label="Risk level"
          tone={inspector.severity ? severityTone[inspector.severity] : undefined}
          value={inspector.severity ?? "INFO"}
        />
        <InspectorStat
          label="Confidence"
          tone="success"
          value={`${Math.round(inspector.confidence * 100)}%`}
        />
      </dl>

      <InspectorCard
        icon={CheckCircle2}
        title="Your obligations"
        value={inspector.keyInfo[0]?.value ?? inspector.commercialImpact}
      />
      <InspectorCard
        icon={GitBranch}
        title="Conditions"
        value={condition?.relationship ?? inspector.uncertainty}
      />
      <InspectorCard
        icon={AlertCircle}
        title="Consequences"
        value={consequence?.relationship ?? inspector.commercialImpact}
      />

      <section>
        <h3 className="text-sm font-medium">
          Connected items ({inspector.dependencyChain.length})
        </h3>
        <div className="mt-3 space-y-2">
          {inspector.dependencyChain.slice(0, 4).map((dependency) => (
            <div
              className="flex items-center justify-between gap-3 text-xs"
              key={dependency.id}
            >
              <span className="truncate text-foreground">{dependency.label}</span>
              <span className="shrink-0 text-muted-foreground">
                {dependency.severity ? dependency.severity.toLowerCase() : "linked"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Button className="w-full" icon={Link2} variant="accent">
        Add to negotiation list
      </Button>
    </div>
  );
}

function InspectorStat({
  label,
  tone,
  value,
}: {
  label: string;
  tone?: BadgeTone;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background/55 p-3">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-2">
        <Badge tone={tone}>{value}</Badge>
      </dd>
    </div>
  );
}

function InspectorCard({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof CheckCircle2;
  title: string;
  value: string;
}) {
  return (
    <section className="rounded-md border border-border bg-background/55 p-4">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="size-4 text-primary" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{value}</p>
    </section>
  );
}
