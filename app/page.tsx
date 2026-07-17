import {
  BarChart3,
  Bell,
  Bot,
  Clock3,
  Download,
  FileText,
  GitBranch,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { demoAnalysis } from "@/features/demo/fixture";
import type { DemoFinding, DemoMetric } from "@/features/demo/types";

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

export default function Home() {
  const analysis = demoAnalysis;
  const selectedInspector =
    analysis.inspectors.find(
      (inspector) => inspector.id === analysis.defaultInspectorId,
    ) ?? analysis.inspectors[0];

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
                action="10 nodes"
              />
              <div className="grid min-h-[360px] place-items-center border-t border-border p-6">
                <div className="w-full max-w-2xl">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <GraphStat label="Parties" value="2" />
                    <GraphStat label="Clause clusters" value="4" />
                    <GraphStat label="Risk paths" value="2" />
                  </div>
                  <div className="mt-5 rounded-md border border-dashed border-border bg-background/45 p-5">
                    <div className="flex items-center gap-3">
                      <BarChart3
                        aria-hidden="true"
                        className="size-5 text-primary"
                      />
                      <p className="text-sm font-medium">
                        Deterministic graph viewport
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Fees, termination, service credits, and liability cap paths
                      are ready for the static SVG graph layer.
                    </p>
                  </div>
                </div>
              </div>
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Inspector
              </p>
              <h2 className="mt-2 text-base font-semibold">
                {selectedInspector.title}
              </h2>
            </div>
            <span className="rounded-sm border border-border bg-background px-2 py-1 font-mono text-xs text-muted-foreground">
              {selectedInspector.clauseRef}
            </span>
          </div>

          <div className="mt-5 rounded-md border border-border bg-background/55 p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              {selectedInspector.summary}
            </p>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {selectedInspector.keyInfo.map((item) => (
              <div
                className="rounded-md border border-border bg-background/55 p-3"
                key={item.label}
              >
                <dt className="text-xs text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 text-sm text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
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

function GraphStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-raised p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
