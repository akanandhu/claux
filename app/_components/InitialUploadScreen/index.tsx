"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { FileUp, Loader2, UserRound } from "lucide-react";

import { Button } from "@/components/Button";
import { RoleButton } from "../RoleButton";
import type { JobStage, ReviewerRole } from "../WorkspaceShell/types";
import { isBusyStage, jobStageDescription, jobStageLabel } from "./utils";

export function InitialUploadScreen({
  error,
  jobStartedAt,
  jobStage,
  onOpenDemo,
  onRoleChange,
  onUpload,
  reviewerRole,
  uploadedFileName,
}: {
  error: string | null;
  jobStartedAt: number | null;
  jobStage: JobStage;
  onOpenDemo: () => void;
  onRoleChange: (role: ReviewerRole) => void;
  onUpload: (file: File) => void;
  reviewerRole: ReviewerRole;
  uploadedFileName: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = isBusyStage(jobStage);
  const elapsedSeconds = useElapsedSeconds({
    active: isLoading,
    startedAt: jobStartedAt,
  });

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      onUpload(file);
      event.target.value = "";
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen items-center justify-center px-4 py-10 lg:px-8">
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
              Upload a contract to analyze
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
                accept=".pdf,.docx,.txt,.rtf,.odt"
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
                {isLoading ? jobStageLabel(jobStage) : "Upload PDF, DOCX, or TXT"}
              </Button>
              <Button
                className="mt-3 w-full justify-center"
                disabled={isLoading}
                onClick={onOpenDemo}
              >
                Open demo fixture
              </Button>
              {uploadedFileName ? (
                <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
                  {isLoading
                    ? `${jobStageLabel(jobStage)}: ${uploadedFileName}`
                    : uploadedFileName}
                </p>
              ) : null}
              {isLoading ? (
                <div
                  aria-live="polite"
                  className="mt-4 rounded-md border border-primary/25 bg-primary/10 p-3"
                  role="status"
                >
                  <div className="flex items-start gap-3">
                    <Loader2
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 animate-spin text-primary"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {jobStageLabel(jobStage)}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {jobStageDescription(jobStage, elapsedSeconds)}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                        Elapsed {elapsedSeconds}s
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background">
                    <div
                      className={`h-full rounded-full bg-primary transition-all ${
                        jobStage === "analyzing" ? "animate-pulse" : ""
                      }`}
                      style={{ width: `${stageProgress(jobStage, elapsedSeconds)}%` }}
                    />
                  </div>
                </div>
              ) : null}
              {error ? (
                <p
                  className="mt-3 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm leading-6 text-danger"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Parsing starts in your browser. Only extracted clauses are sent
                to Claux route handlers for evidence-gated analysis.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function useElapsedSeconds({
  active,
  startedAt,
}: {
  active: boolean;
  startedAt: number | null;
}) {
  const [timer, setTimer] = useState({
    elapsedSeconds: 0,
    startedAt,
  });

  useEffect(() => {
    if (!active || !startedAt) {
      const resetId = window.setTimeout(
        () => setTimer({ elapsedSeconds: 0, startedAt }),
        0,
      );

      return () => window.clearTimeout(resetId);
    }

    const resetId = window.setTimeout(
      () => setTimer({ elapsedSeconds: 0, startedAt }),
      0,
    );
    const intervalId = window.setInterval(() => {
      setTimer({
        elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000),
        startedAt,
      });
    }, 1000);

    return () => {
      window.clearTimeout(resetId);
      window.clearInterval(intervalId);
    };
  }, [active, startedAt]);

  if (!active || !startedAt || timer.startedAt !== startedAt) return 0;

  return timer.elapsedSeconds;
}

function stageProgress(stage: JobStage, elapsedSeconds: number) {
  if (stage === "analyzing") {
    return Math.min(88, 62 + Math.floor(elapsedSeconds / 3));
  }

  const progress: Record<JobStage, number> = {
    analyzing: 62,
    building_view: 92,
    completed: 100,
    extracting: 20,
    failed: 100,
    idle: 0,
    partial: 100,
    scoring: 84,
    segmenting: 38,
    submitting_analysis: 50,
    validating: 10,
    verifying: 76,
  };

  return progress[stage];
}
