"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Bot,
  Clock3,
  Download,
  FileText,
  GitBranch,
  Maximize2,
  Minus,
  MousePointer2,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  WandSparkles,
  X,
} from "lucide-react";

import { demoAnalysis } from "@/features/demo/fixture";
import type {
  DemoFinding,
  DemoGraphEdge,
  DemoGraphNode,
  DemoInspector,
  DemoMetric,
  PresentationLabel,
} from "@/features/demo/types";

const metricTone: Record<DemoMetric["tone"], string> = {
  neutral: "border-border bg-surface-raised text-foreground",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  accent: "border-ai-accent/30 bg-ai-accent/10 text-ai-accent",
};

const severityTone: Record<DemoFinding["severity"], string> = {
  INFO: "border-primary/30 bg-primary/10 text-primary",
  LOW: "border-success/30 bg-success/10 text-success",
  MEDIUM: "border-warning/30 bg-warning/10 text-warning",
  HIGH: "border-danger/30 bg-danger/10 text-danger",
  CRITICAL: "border-danger bg-danger/20 text-danger",
};

const graphNodeTone: Partial<
  Record<DemoGraphNode["type"], { fill: string; stroke: string; text: string }>
> = {
  CLAUSE: { fill: "#2563eb", stroke: "#93c5fd", text: "#dbeafe" },
  OBLIGATION: { fill: "#7c3aed", stroke: "#c4b5fd", text: "#ede9fe" },
  RIGHT: { fill: "#22c55e", stroke: "#86efac", text: "#dcfce7" },
  CONDITION: { fill: "#f59e0b", stroke: "#fcd34d", text: "#fef3c7" },
  PARTY: { fill: "#14b8a6", stroke: "#5eead4", text: "#ccfbf1" },
  FINDING: { fill: "#ef4444", stroke: "#fca5a5", text: "#fee2e2" },
  CONTRACT: { fill: "#1f2937", stroke: "#94a3b8", text: "#f8fafc" },
};

const graphLegend = [
  { label: "Clause", color: "#2563eb" },
  { label: "Obligation", color: "#7c3aed" },
  { label: "Right", color: "#22c55e" },
  { label: "Condition", color: "#f59e0b" },
  { label: "Party", color: "#14b8a6" },
  { label: "Risk", color: "#ef4444" },
];

const labelTone: Record<PresentationLabel, string> = {
  FACT: "border-primary/30 bg-primary/10 text-primary",
  STRUCTURAL_DIAGNOSTIC: "border-primary/30 bg-primary/10 text-primary",
  CONTRACT_SMELL: "border-warning/30 bg-warning/10 text-warning",
  COMMERCIAL_RISK: "border-danger/30 bg-danger/10 text-danger",
  LEGAL_REVIEW_SIGNAL: "border-warning/30 bg-warning/10 text-warning",
  NEGOTIATION_SUGGESTION: "border-ai-accent/30 bg-ai-accent/10 text-ai-accent",
  UNCERTAIN: "border-border bg-surface-raised text-muted-foreground",
};

const inspectorTabs = ["summary", "evidence", "dependencies", "history"] as const;
type InspectorTab = (typeof inspectorTabs)[number];

export default function Home() {
  const analysis = demoAnalysis;
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
  const selectedNodeId = selectedInspector.nodeId;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[18rem_minmax(0,1fr)_22rem]">
        <aside className="border-b border-border bg-surface/85 px-4 py-4 xl:border-b-0 xl:border-r xl:px-5 xl:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 xl:block">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md border border-primary/40 bg-primary/15 text-primary">
                <FileText aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide">Claux</p>
                <p className="text-xs text-muted-foreground">
                  Contract intelligence
                </p>
              </div>
            </div>

            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface-raised px-3 text-xs font-medium text-foreground transition hover:border-primary/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary xl:mt-6 xl:w-full xl:justify-center">
              <RefreshCw aria-hidden="true" className="size-4" />
              Replace document
            </button>
          </div>

          <div className="mt-5 rounded-md border border-border bg-background/55 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Primary contract
            </p>
            <h2 className="mt-2 text-sm font-medium leading-5">
              {analysis.contract.fileName}
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Type</dt>
                <dd className="mt-1 text-foreground">
                  {analysis.contract.contractType}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd className="mt-1 text-foreground">
                  {analysis.contract.reviewingRole}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Pages</dt>
                <dd className="mt-1 text-foreground">
                  {analysis.contract.pageCount}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Clauses</dt>
                <dd className="mt-1 text-foreground">
                  {analysis.contract.clauseCount}
                </dd>
              </div>
            </dl>
          </div>

          <nav aria-label="Workspace navigation" className="mt-5">
            <ul className="grid gap-1 sm:grid-cols-2 xl:grid-cols-1">
              {analysis.navItems.map((item) => (
                <li key={item.id}>
                  <a
                    className="flex h-10 items-center justify-between rounded-md px-3 text-sm text-muted-foreground transition hover:bg-surface-raised hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    href={`#${item.id}`}
                  >
                    <span>{item.label}</span>
                    <span className="rounded-sm border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                      {item.count}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <footer className="mt-5 rounded-md border border-border bg-background/55 p-4 text-xs text-muted-foreground xl:mt-auto">
            <div className="flex items-center gap-2 text-foreground">
              <Clock3 aria-hidden="true" className="size-4 text-primary" />
              Analysis metadata
            </div>
            <p className="mt-2">
              Completed {formatDateTime(analysis.contract.analysisCompletedAt)}
            </p>
            <p className="mt-1">Static reviewed fixture, browser-local demo.</p>
          </footer>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="border-b border-border bg-background/95 px-4 py-4 lg:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium">
                    {analysis.contract.fileName}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-sm border border-success/30 bg-success/10 px-2 py-1 text-xs font-medium text-success">
                    <ShieldCheck aria-hidden="true" className="size-3.5" />
                    Analysis complete
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {analysis.contract.contractType} for{" "}
                  {analysis.contract.reviewingRole.toLowerCase()} review
                </p>
              </div>

              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                <label className="relative min-w-0 sm:w-72">
                  <span className="sr-only">Search clauses, risks, evidence</span>
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    className="h-9 w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25"
                    placeholder="Search clauses, risks, evidence"
                    type="search"
                  />
                </label>
                <div className="flex items-center gap-2">
                  <ToolbarButton icon={GitBranch} label="Compare" />
                  <ToolbarButton icon={Download} label="Export" />
                  <ToolbarButton icon={Settings} label="Settings" compact />
                  <button className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-white transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                    <Bot aria-hidden="true" className="size-4" />
                    Ask
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 space-y-5 p-4 lg:p-6">
            <section
              aria-label="Dashboard metrics"
              className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4"
            >
              {analysis.metrics.map((metric) => (
                <article
                  className="min-h-28 rounded-md border border-border bg-surface p-4"
                  key={metric.id}
                >
                  <div
                    className={`inline-flex rounded-sm border px-2 py-1 text-xs font-medium ${metricTone[metric.tone]}`}
                  >
                    {metric.label}
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-normal">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {metric.detail}
                  </p>
                </article>
              ))}
            </section>

            <section
              className="rounded-md border border-border bg-surface"
              id="overview"
            >
              <PanelHeader
                icon={GitBranch}
                eyebrow="Graph"
                title="Contract structure"
                action={`${analysis.graph.nodes.length} nodes`}
              />
              <StaticContractGraph
                graph={analysis.graph}
                onSelectInspector={(inspectorId) => {
                  setSelectedInspectorId(inspectorId);
                  setActiveInspectorTab("summary");
                  setInspectorOpen(true);
                }}
                selectedNodeId={selectedNodeId}
              />
            </section>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <section className="rounded-md border border-border bg-surface">
                <PanelHeader
                  icon={FileText}
                  eyebrow="Summary"
                  title="Executive summary"
                  action={`${analysis.executiveSummary.length} notes`}
                />
                <div className="space-y-3 border-t border-border p-4">
                  {analysis.executiveSummary.map((item) => (
                    <p
                      className="rounded-md border border-border bg-background/45 p-3 text-sm leading-6 text-muted-foreground"
                      key={item}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </section>

              <section className="rounded-md border border-border bg-surface">
                <PanelHeader
                  icon={Bell}
                  eyebrow="Findings"
                  title="Top findings"
                  action={`${analysis.topFindings.length} open`}
                />
                <div className="space-y-3 border-t border-border p-4">
                  {analysis.topFindings.map((finding) => (
                    <article
                      className="rounded-md border border-border bg-background/45 p-3"
                      key={finding.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-medium leading-5">
                          {finding.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-sm border px-2 py-1 text-[11px] font-medium ${severityTone[finding.severity]}`}
                        >
                          {finding.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {finding.summary}
                      </p>
                      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                        {finding.clauseRefs.join(" / ")}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        <aside className="border-t border-border bg-surface/85 px-4 py-5 xl:border-l xl:border-t-0 xl:px-5">
          {inspectorOpen ? (
            <ClauseInspector
              activeTab={activeInspectorTab}
              inspector={selectedInspector}
              onClose={() => setInspectorOpen(false)}
              onTabChange={setActiveInspectorTab}
            />
          ) : (
            <div className="rounded-md border border-border bg-background/55 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Inspector
              </p>
              <button
                className="mt-3 inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-foreground transition hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                onClick={() => setInspectorOpen(true)}
                type="button"
              >
                Open selected clause
              </button>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

function ToolbarButton({
  compact = false,
  icon: Icon,
  label,
}: {
  compact?: boolean;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
}) {
  return (
    <button
      aria-label={compact ? label : undefined}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Icon aria-hidden={true} className="size-4" />
      <span className={compact ? "sr-only" : ""}>{label}</span>
    </button>
  );
}

function ClauseInspector({
  activeTab,
  inspector,
  onClose,
  onTabChange,
}: {
  activeTab: InspectorTab;
  inspector: DemoInspector;
  onClose: () => void;
  onTabChange: (tab: InspectorTab) => void;
}) {
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
        <button
          aria-label="Close inspector"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:border-danger/50 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-sm border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {inspector.nodeType}
        </span>
        {inspector.severity ? (
          <span
            className={`rounded-sm border px-2 py-1 text-xs font-medium ${severityTone[inspector.severity]}`}
          >
            {inspector.severity}
          </span>
        ) : null}
        <span className="rounded-sm border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
          {Math.round(inspector.confidence * 100)}% confidence
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {inspector.labels.map((label) => (
          <span
            className={`rounded-sm border px-2 py-1 text-[11px] font-medium ${labelTone[label]}`}
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
          <button
            aria-selected={activeTab === tab}
            className={`h-8 rounded-sm px-2 text-xs font-medium capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
              activeTab === tab
                ? "bg-surface-raised text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            key={tab}
            onClick={() => onTabChange(tab)}
            role="tab"
            type="button"
          >
            {tab}
          </button>
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

function InspectorSummary({ inspector }: { inspector: DemoInspector }) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-background/55 p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {inspector.summary}
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        {inspector.keyInfo.map((item) => (
          <div
            className="rounded-md border border-border bg-background/55 p-3"
            key={item.label}
          >
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="mt-1 text-sm text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>

      <InspectorNote title="Commercial impact" value={inspector.commercialImpact} />
      <InspectorNote title="Uncertainty" value={inspector.uncertainty} />

      <div className="rounded-md border border-ai-accent/30 bg-ai-accent/10 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ai-accent">
          Negotiation suggestion
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {inspector.suggestedAction}
        </p>
        <button
          className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-ai-accent px-3 text-sm font-medium text-white transition hover:bg-ai-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ai-accent"
          type="button"
        >
          <WandSparkles aria-hidden="true" className="size-4" />
          Draft suggested action
        </button>
      </div>
    </div>
  );
}

function InspectorEvidence({ inspector }: { inspector: DemoInspector }) {
  return (
    <div className="space-y-3">
      {inspector.evidence.map((evidence) => (
        <article
          className="rounded-md border border-border bg-background/55 p-4"
          key={evidence.id}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs text-muted-foreground">
              {evidence.clauseRef} / page {evidence.page}
            </p>
            <span className="rounded-sm border border-border bg-surface px-2 py-1 text-[11px] text-muted-foreground">
              {formatLabel(evidence.validationStatus)}
            </span>
          </div>
          <blockquote className="mt-3 border-l-2 border-primary/60 pl-3 font-mono text-xs leading-6 text-foreground">
            {evidence.excerpt}
          </blockquote>
        </article>
      ))}
    </div>
  );
}

function InspectorDependencies({ inspector }: { inspector: DemoInspector }) {
  return (
    <div className="space-y-3">
      {inspector.dependencyChain.map((dependency, index) => (
        <article
          className="rounded-md border border-border bg-background/55 p-4"
          key={dependency.id}
        >
          <div className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-border bg-surface font-mono text-xs text-muted-foreground">
              {index + 1}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-medium">{dependency.label}</h3>
                {dependency.severity ? (
                  <span
                    className={`rounded-sm border px-2 py-0.5 text-[11px] font-medium ${severityTone[dependency.severity]}`}
                  >
                    {dependency.severity}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {dependency.relationship}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function InspectorHistory({ inspector }: { inspector: DemoInspector }) {
  return (
    <div className="space-y-3">
      {inspector.history.map((item) => (
        <article
          className="rounded-md border border-border bg-background/55 p-4"
          key={item.label}
        >
          <p className="text-sm font-medium">{item.label}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.detail}
          </p>
        </article>
      ))}
    </div>
  );
}

function InspectorNote({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-md border border-border bg-background/55 p-4">
      <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </section>
  );
}

function StaticContractGraph({
  graph,
  onSelectInspector,
  selectedNodeId,
}: {
  graph: {
    nodes: DemoGraphNode[];
    edges: DemoGraphEdge[];
  };
  onSelectInspector: (inspectorId: string) => void;
  selectedNodeId: string;
}) {
  const graphIndex = useMemo(() => {
    const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
    const selectedEdgeIds = new Set<string>();
    const selectedNodeIds = new Set([selectedNodeId]);

    graph.edges.forEach((edge) => {
      if (edge.source === selectedNodeId || edge.target === selectedNodeId) {
        selectedEdgeIds.add(edge.id);
        selectedNodeIds.add(edge.source);
        selectedNodeIds.add(edge.target);
      }
    });

    return { nodesById, selectedEdgeIds, selectedNodeIds };
  }, [graph.edges, graph.nodes, selectedNodeId]);

  return (
    <div className="border-t border-border">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {graphLegend.map((item) => (
            <span
              className="inline-flex items-center gap-2 text-xs text-muted-foreground"
              key={item.label}
            >
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <GraphControlButton icon={Minus} label="Zoom out" />
          <GraphControlButton icon={Plus} label="Zoom in" />
          <GraphControlButton icon={Maximize2} label="Fit graph" />
          <GraphControlButton icon={MousePointer2} label="Select mode" />
        </div>
      </div>

      <div className="overflow-hidden p-3 sm:p-4">
        <svg
          aria-label="Static contract structure graph"
          className="min-h-[360px] w-full rounded-md border border-border bg-background"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          viewBox="0 0 790 310"
        >
          <defs>
            <marker
              id="arrow-dependency"
              markerHeight="8"
              markerWidth="8"
              orient="auto"
              refX="7"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#60a5fa" />
            </marker>
            <marker
              id="arrow-risk"
              markerHeight="8"
              markerWidth="8"
              orient="auto"
              refX="7"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#f87171" />
            </marker>
            <marker
              id="arrow-reference"
              markerHeight="8"
              markerWidth="8"
              orient="auto"
              refX="7"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#94a3b8" />
            </marker>
          </defs>

          <g>
            {graph.edges.map((edge) => {
              const source = graphIndex.nodesById.get(edge.source);
              const target = graphIndex.nodesById.get(edge.target);

              if (!source || !target) {
                return null;
              }

              const isSelected = graphIndex.selectedEdgeIds.has(edge.id);
              const color = edgeColor(edge.pathType);

              return (
                <line
                  key={edge.id}
                  markerEnd={`url(#arrow-${edge.pathType})`}
                  stroke={color}
                  strokeDasharray={edge.dashed ? "7 7" : undefined}
                  strokeLinecap="round"
                  strokeOpacity={isSelected ? 0.95 : 0.28}
                  strokeWidth={isSelected ? 3 : 1.7}
                  x1={source.x}
                  x2={target.x}
                  y1={source.y}
                  y2={target.y}
                />
              );
            })}
          </g>

          <g>
            {graph.nodes.map((node) => {
              const tone = graphNodeTone[node.type] ?? graphNodeTone.CLAUSE!;
              const isSelected = node.id === selectedNodeId;
              const isConnected = graphIndex.selectedNodeIds.has(node.id);
              const isDimmed = !isSelected && !isConnected;
              const canInspect = Boolean(node.inspectorId);

              return (
                <g
                  aria-label={`${node.label} ${node.type.toLowerCase()}`}
                  className={canInspect ? "cursor-pointer outline-none" : ""}
                  key={node.id}
                  onClick={() => {
                    if (node.inspectorId) {
                      onSelectInspector(node.inspectorId);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (
                      node.inspectorId &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      onSelectInspector(node.inspectorId);
                    }
                  }}
                  role={canInspect ? "button" : "img"}
                  tabIndex={canInspect ? 0 : undefined}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    fill={tone.fill}
                    opacity={isDimmed ? 0.46 : 0.95}
                    r={isSelected ? node.size / 2 + 5 : node.size / 2}
                    stroke={isSelected ? "#f8fafc" : tone.stroke}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    fill="none"
                    opacity={isSelected ? 0.55 : 0}
                    r={node.size / 2 + 10}
                    stroke={tone.stroke}
                    strokeWidth="1.5"
                  />
                  <text
                    fill={tone.text}
                    fontSize={node.label.length > 11 ? "9" : "11"}
                    fontWeight="700"
                    pointerEvents="none"
                    textAnchor="middle"
                    x={node.x}
                    y={node.y + 4}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

function GraphControlButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      type="button"
    >
      <Icon aria-hidden={true} className="size-4" />
    </button>
  );
}

function edgeColor(pathType: DemoGraphEdge["pathType"]) {
  if (pathType === "risk") {
    return "#f87171";
  }

  if (pathType === "reference") {
    return "#94a3b8";
  }

  return "#60a5fa";
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function PanelHeader({
  action,
  eyebrow,
  icon: Icon,
  title,
}: {
  action: string;
  eyebrow: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-primary">
          <Icon aria-hidden={true} className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="truncate text-base font-semibold">{title}</h2>
        </div>
      </div>
      <span className="shrink-0 rounded-sm border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
        {action}
      </span>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
