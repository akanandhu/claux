"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { FileUp, Loader2, UserRound } from "lucide-react";

import { ClauseInspector } from "../ClauseInspector";
import { DashboardMain } from "../DashboardMain";
import { Sidebar } from "../Sidebar";
import { TopBar } from "../TopBar";
import { useWorkspaceSelection } from "./useHook";
import { Button } from "@/components/Button";
import type { WorkspaceShellProps } from "./types";

type ReviewerRole = "received" | "prepared";

const roleLabels: Record<ReviewerRole, string> = {
  prepared: "I prepared this contract",
  received: "I received this contract",
};

export function WorkspaceShell({ analysis }: WorkspaceShellProps) {
  const [reviewerRole, setReviewerRole] = useState<ReviewerRole>("received");
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const {
    activeInspectorTab,
    inspectorOpen,
    selectedInspector,
    selectedNodeId,
    selectInspector,
    setActiveInspectorTab,
    setInspectorOpen,
  } = useWorkspaceSelection(analysis);

  function handleUpload(file: File) {
    setUploadedFileName(file.name);
    setIsLoading(true);

    window.setTimeout(() => {
      setIsLoading(false);
      setWorkspaceReady(true);
    }, 1200);
  }

  if (!workspaceReady) {
    return (
      <InitialUploadScreen
        isLoading={isLoading}
        onRoleChange={setReviewerRole}
        onUpload={handleUpload}
        reviewerRole={reviewerRole}
        uploadedFileName={uploadedFileName}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[18rem_minmax(0,1fr)_22rem]">
        <Sidebar roleLabel={roleLabels[reviewerRole]} />
        <section className="flex min-w-0 flex-col">
          <div className="sticky top-0 z-20">
            <TopBar contract={analysis.contract} />
          </div>
          <DashboardMain
            analysis={analysis}
            onSelectInspector={selectInspector}
            selectedNodeId={selectedNodeId}
          />
        </section>
        <aside className="border-t border-border bg-surface/85 px-4 py-5 xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto xl:border-l xl:border-t-0 xl:px-5">
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

function InitialUploadScreen({
  isLoading,
  onRoleChange,
  onUpload,
  reviewerRole,
  uploadedFileName,
}: {
  isLoading: boolean;
  onRoleChange: (role: ReviewerRole) => void;
  onUpload: (file: File) => void;
  reviewerRole: ReviewerRole;
  uploadedFileName: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      onUpload(file);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="flex min-w-0 items-center justify-center px-4 py-10 lg:px-8">
          <div className="w-full max-w-2xl">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md border border-primary/40 bg-primary/15 text-primary">
                <UserRound aria-hidden="true" className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide">Claux</p>
                <p className="text-xs text-muted-foreground">
                  Contract intelligence
                </p>
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              New clause review
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Upload a legal clause to analyze
            </h1>

            <div className="mt-8 rounded-md border border-border bg-surface/80 p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/35 bg-primary/15 text-primary">
                  <UserRound aria-hidden="true" className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-medium">
                    What is your role for this clause?
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Did you receive this contract, or did you prepare it?
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <RoleButton
                  active={reviewerRole === "received"}
                  onClick={() => onRoleChange("received")}
                >
                  I received this contract
                </RoleButton>
                <RoleButton
                  active={reviewerRole === "prepared"}
                  onClick={() => onRoleChange("prepared")}
                >
                  I prepared this contract
                </RoleButton>
              </div>

              <input
                accept=".pdf,.doc,.docx,.txt"
                className="sr-only"
                disabled={isLoading}
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
              />
              <Button
                className="mt-6 w-full"
                disabled={isLoading}
                icon={isLoading ? Loader2 : FileUp}
                onClick={() => fileInputRef.current?.click()}
                variant="primary"
              >
                {isLoading ? "Analyzing clause..." : "Upload legal clause"}
              </Button>
              {uploadedFileName ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  {isLoading
                    ? `Preparing ${uploadedFileName}`
                    : uploadedFileName}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <aside className="border-t border-border bg-surface/85 px-4 py-5 xl:border-l xl:border-t-0 xl:px-5">
          <TypewriterPlaceholder />
        </aside>
      </div>
    </main>
  );
}

function RoleButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
        active
          ? "border-primary/70 bg-primary/15 text-foreground"
          : "border-border bg-background/55 text-muted-foreground hover:border-primary/45 hover:text-foreground"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function TypewriterPlaceholder() {
  return (
    <div className="rounded-md border border-border bg-background/55 p-4 xl:sticky xl:top-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Clause test area
      </p>
      <h2 className="mt-3 text-xl font-semibold">Hello.</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Sample clause files will attach here for testing before analysis starts.
      </p>
      <div className="mt-8 rounded-md border border-border bg-surface/75 p-3 font-mono text-xs text-muted-foreground">
        <p className="clause-typewriter">
          Waiting for a legal clause...
        </p>
      </div>
    </div>
  );
}
