"use client";

import { ClauseInspector } from "../ClauseInspector";
import { DashboardMain } from "../DashboardMain";
import { Sidebar } from "../Sidebar";
import { TopBar } from "../TopBar";
import { useWorkspaceSelection } from "./useHook";
import { Button } from "@/components/Button";
import type { WorkspaceShellProps } from "./types";

export function WorkspaceShell({ analysis }: WorkspaceShellProps) {
  const {
    activeInspectorTab,
    inspectorOpen,
    selectedInspector,
    selectedNodeId,
    selectInspector,
    setActiveInspectorTab,
    setInspectorOpen,
  } = useWorkspaceSelection(analysis);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[18rem_minmax(0,1fr)_22rem]">
        <Sidebar analysis={analysis} />
        <section className="flex min-w-0 flex-col">
          <TopBar contract={analysis.contract} />
          <DashboardMain
            analysis={analysis}
            onSelectInspector={selectInspector}
            selectedNodeId={selectedNodeId}
          />
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
              <Button className="mt-3" onClick={() => setInspectorOpen(true)}>
                Open selected clause
              </Button>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
