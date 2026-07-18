"use client";

import { useRef, useState, type ChangeEvent } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  FileUp,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  ScrollText,
  UserRound,
} from "lucide-react";

import { ClauseInspector } from "../ClauseInspector";
import { DashboardMain } from "../DashboardMain";
import { Sidebar } from "../Sidebar";
import { TopBar } from "../TopBar";
import {
  contractOutline,
  findContractClause,
  findContractSection,
  type ContractSection,
} from "../contractOutline";
import { useWorkspaceSelection } from "./useHook";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import type { WorkspaceShellProps } from "./types";

type ReviewerRole = "received" | "prepared";
type RightSidebarView = "summary" | "section" | "clause" | "inspector";

const roleLabels: Record<ReviewerRole, string> = {
  prepared: "I prepared this contract",
  received: "I received this contract",
};

const contractTakeaways = [
  "Liability is capped",
  "Provider may suspend service",
  "Confidentiality survives termination",
];

export function WorkspaceShell({ analysis }: WorkspaceShellProps) {
  const outline = analysis.outline ?? contractOutline;
  const [reviewerRole, setReviewerRole] = useState<ReviewerRole>("received");
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inspectorHistory, setInspectorHistory] = useState<string[]>([]);
  const [activeClauseId, setActiveClauseId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [rightSidebarSectionId, setRightSidebarSectionId] = useState<
    string | null
  >(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [rightSidebarView, setRightSidebarView] =
    useState<RightSidebarView>("summary");
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

  function handleSelectSection(sectionId: string) {
    setActiveSectionId(sectionId);
    setRightSidebarSectionId(sectionId);
    setActiveClauseId(null);
    setRightSidebarOpen(true);
    setRightSidebarView("section");
  }

  function handleSelectClause(clauseId: string, sectionId: string) {
    setActiveClauseId(clauseId);
    setActiveSectionId(sectionId);
    setRightSidebarSectionId(sectionId);
    setRightSidebarOpen(true);
    setRightSidebarView("clause");
  }

  function previewSection(sectionId: string) {
    setRightSidebarSectionId(sectionId);
    setActiveClauseId(null);
    setRightSidebarOpen(true);
    setRightSidebarView("section");
  }

  function viewSectionFlow(sectionId: string) {
    setActiveSectionId(sectionId);
    setActiveClauseId(null);
    setRightSidebarSectionId(sectionId);
    setRightSidebarOpen(true);
    setRightSidebarView("section");
  }

  function showContractSummary() {
    setRightSidebarView("summary");
    setInspectorHistory([]);
    setActiveClauseId(null);
    setActiveSectionId(null);
    setRightSidebarSectionId(null);
  }

  function showPreviousInspector() {
    const previousInspectorId = inspectorHistory.at(-1);

    if (!previousInspectorId) {
      showContractSummary();
      return;
    }

    setInspectorHistory((history) => history.slice(0, -1));
    setRightSidebarView("inspector");
    setInspectorOpen(true);
    selectInspector(previousInspectorId);
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
      <div
        className={`grid min-h-screen grid-cols-1 ${
          rightSidebarOpen
            ? "xl:grid-cols-[18rem_minmax(0,1fr)_22rem]"
            : "xl:grid-cols-[18rem_minmax(0,1fr)_4rem]"
        }`}
      >
        <Sidebar
          activeClauseId={activeClauseId}
          activeSectionId={activeSectionId}
          analysis={analysis}
          contractFileName={uploadedFileName ?? analysis.contract.fileName}
          onSelectClause={handleSelectClause}
          onSelectSection={handleSelectSection}
          outline={outline}
          reviewerRoleLabel={roleLabels[reviewerRole]}
        />
        <section className="flex min-w-0 flex-col">
          <div className="sticky top-0 z-20">
            <TopBar contract={analysis.contract} />
          </div>
          <DashboardMain
            activeClauseId={activeClauseId}
            activeSectionId={activeSectionId}
            analysis={analysis}
            onSelectClause={handleSelectClause}
            onSelectSection={handleSelectSection}
            outline={outline}
            selectedInspector={selectedInspector}
            selectedNodeId={selectedNodeId}
          />
        </section>
        <RightSidebar
          activeInspectorTab={activeInspectorTab}
          canGoBack={inspectorHistory.length > 0}
          clauseSelection={findContractClause(activeClauseId, outline)}
          contractType={analysis.contract.contractType}
          inspectorOpen={inspectorOpen}
          isOpen={rightSidebarOpen}
          onBack={showPreviousInspector}
          onPreviewSection={previewSection}
          onSelectClause={handleSelectClause}
          onShowSummary={showContractSummary}
          onViewSectionFlow={viewSectionFlow}
          outline={outline}
          selectedInspector={selectedInspector}
          selectedSection={findContractSection(rightSidebarSectionId, outline)}
          setActiveInspectorTab={setActiveInspectorTab}
          setInspectorOpen={setInspectorOpen}
          setIsOpen={setRightSidebarOpen}
          view={rightSidebarView}
        />
      </div>
    </main>
  );
}

function RightSidebar({
  activeInspectorTab,
  canGoBack,
  clauseSelection,
  contractType,
  inspectorOpen,
  isOpen,
  onBack,
  onPreviewSection,
  onSelectClause,
  onShowSummary,
  onViewSectionFlow,
  outline,
  selectedInspector,
  selectedSection,
  setActiveInspectorTab,
  setInspectorOpen,
  setIsOpen,
  view,
}: {
  activeInspectorTab: Parameters<typeof ClauseInspector>[0]["activeTab"];
  canGoBack: boolean;
  clauseSelection: ReturnType<typeof findContractClause>;
  contractType: string;
  inspectorOpen: boolean;
  isOpen: boolean;
  onBack: () => void;
  onPreviewSection: (sectionId: string) => void;
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onShowSummary: () => void;
  onViewSectionFlow: (sectionId: string) => void;
  outline: ContractSection[];
  selectedInspector: Parameters<typeof ClauseInspector>[0]["inspector"];
  selectedSection: ReturnType<typeof findContractSection>;
  setActiveInspectorTab: Parameters<typeof ClauseInspector>[0]["onTabChange"];
  setInspectorOpen: (open: boolean) => void;
  setIsOpen: (open: boolean) => void;
  view: RightSidebarView;
}) {
  if (!isOpen) {
    return (
      <aside className="border-t border-border bg-surface/85 p-2 xl:sticky xl:top-0 xl:flex xl:h-screen xl:flex-col xl:items-center xl:border-l xl:border-t-0">
        <Button
          icon={PanelRightOpen}
          iconOnlyLabel="Expand right sidebar"
          onClick={() => setIsOpen(true)}
          size="icon"
        />
        <div className="mt-12 hidden rotate-90 whitespace-nowrap text-xs uppercase tracking-[0.18em] text-muted-foreground xl:block">
          Inspector
        </div>
      </aside>
    );
  }

  return (
    <aside className="border-t border-border bg-surface/85 px-4 py-5 xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto xl:border-l xl:border-t-0 xl:px-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <RightSidebarBreadcrumb
          clauseLabel={clauseSelection?.clause.label}
          onShowSummary={onShowSummary}
          onShowSection={() => {
            if (clauseSelection) {
              onPreviewSection(clauseSelection.section.id);
            }
          }}
          sectionLabel={selectedSection?.label ?? clauseSelection?.section.label}
          view={view}
        />
        <div className="flex items-center gap-2">
          {view === "inspector" ? (
            <>
              <Button
                disabled={!canGoBack}
                icon={ArrowLeft}
                iconOnlyLabel="Previous selected clause"
                onClick={onBack}
                size="icon"
              />
              <Button
                icon={ScrollText}
                iconOnlyLabel="Contract summary"
                onClick={onShowSummary}
                size="icon"
              />
            </>
          ) : null}
          <Button
            icon={PanelRightClose}
            iconOnlyLabel="Collapse right sidebar"
            onClick={() => setIsOpen(false)}
            size="icon"
          />
        </div>
      </div>
      {view === "summary" ? (
        <ContractBrief
          contractType={contractType}
          onPreviewSection={onPreviewSection}
          outline={outline}
          selectedSection={selectedSection}
        />
      ) : null}
      {view === "section" && selectedSection ? (
        <SectionDetailPanel
          onSelectClause={onSelectClause}
          onViewFlow={onViewSectionFlow}
          section={selectedSection}
        />
      ) : null}
      {view === "clause" && clauseSelection ? (
        <ClauseRiskPanel
          clause={clauseSelection.clause}
          sectionLabel={clauseSelection.section.label}
        />
      ) : null}
      {view === "inspector" && inspectorOpen ? (
        <ClauseInspector
          activeTab={activeInspectorTab}
          inspector={selectedInspector}
          onTabChange={setActiveInspectorTab}
        />
      ) : null}
      {view === "inspector" && !inspectorOpen ? (
        <div className="rounded-md border border-border bg-background/55 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Inspector
          </p>
          <Button className="mt-3" onClick={() => setInspectorOpen(true)}>
            Open selected clause
          </Button>
        </div>
      ) : null}
    </aside>
  );
}

function ContractBrief({
  contractType,
  onPreviewSection,
  outline,
  selectedSection,
}: {
  contractType: string;
  onPreviewSection: (sectionId: string) => void;
  outline: ContractSection[];
  selectedSection: ReturnType<typeof findContractSection>;
}) {
  const sortedSections = [...outline].sort(
    (left, right) => riskRank[right.risk] - riskRank[left.risk],
  );

  return (
    <section className="rounded-md border border-border bg-background/55 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {selectedSection ? `${selectedSection.label} in short` : "This contract in short"}
      </p>
      <p className="mt-3 text-sm font-medium leading-6">
        {selectedSection
          ? `${selectedSection.label} carries ${selectedSection.risk.toLowerCase()} risk and includes ${selectedSection.count} clauses that should be reviewed together.`
          : `This ${contractType.toLowerCase()} mainly governs software services, payments, confidentiality, and termination.`}
      </p>

      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Things you should know
      </p>
      <ul className="mt-3 grid gap-2">
        {contractTakeaways.map((takeaway) => (
          <li
            className="flex items-start gap-2 rounded-md border border-warning/25 bg-warning/10 px-3 py-2 text-sm leading-5"
            key={takeaway}
          >
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-warning"
            />
            <span>{takeaway}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Sections by risk
      </p>
      <div className="mt-3 grid gap-2">
        {sortedSections.map((section) => (
          <button
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface/70 px-3 py-2 text-left transition hover:border-primary/45 hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
            key={section.id}
            onClick={() => onPreviewSection(section.id)}
            type="button"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">
                {section.label}
              </span>
              <span className="block text-xs text-muted-foreground">
                {section.count} clauses
              </span>
            </span>
            <Badge className="shrink-0" tone={riskBadgeTone(section.risk)}>
              {section.risk}
            </Badge>
          </button>
        ))}
      </div>
    </section>
  );
}

function SectionDetailPanel({
  onSelectClause,
  onViewFlow,
  section,
}: {
  onSelectClause: (clauseId: string, sectionId: string) => void;
  onViewFlow: (sectionId: string) => void;
  section: ContractSection;
}) {
  return (
    <section className="rounded-md border border-border bg-background/55 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Section detail
          </p>
          <h2 className="mt-3 text-base font-semibold">{section.label}</h2>
        </div>
        <Badge tone={riskBadgeTone(section.risk)}>{section.risk} risk</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {section.plainEnglishSummary}
      </p>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Hazards
      </p>
      <ul className="mt-3 space-y-2">
        {section.hazards.map((hazard) => (
          <li className="flex gap-2 text-sm leading-6" key={hazard}>
            <AlertTriangle
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-warning"
            />
            <span className="text-muted-foreground">{hazard}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-md border border-border bg-surface/80 p-3">
        <p className="text-sm font-medium">Should you sign?</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {section.signGuidance}
        </p>
      </div>
      <Button className="mt-5 w-full" onClick={() => onViewFlow(section.id)}>
        View Flow
      </Button>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Clauses
      </p>
      <div className="mt-3 grid gap-2">
        {section.children.map((clause) => (
          <button
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface/70 px-3 py-2 text-left transition hover:border-primary/45 hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
            key={clause.id}
            onClick={() => onSelectClause(clause.id, section.id)}
            type="button"
          >
            <span className="truncate text-sm">{clause.label}</span>
            <Badge className="shrink-0" tone={riskBadgeTone(clause.risk)}>
              {clause.risk}
            </Badge>
          </button>
        ))}
      </div>
    </section>
  );
}

function ClauseRiskPanel({
  clause,
  sectionLabel,
}: {
  clause: NonNullable<ReturnType<typeof findContractClause>>["clause"];
  sectionLabel: string;
}) {
  const hazards = clauseHazards(clause);

  return (
    <section className="rounded-md border border-border bg-background/55 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Clause detail
      </p>
      <h2 className="mt-3 text-base font-semibold">{clause.label}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{sectionLabel}</p>
      <Badge className="mt-4" tone={clause.risk === "High" ? "danger" : "warning"}>
        {clause.risk} risk
      </Badge>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        In simple terms
      </p>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {clause.summary}
      </p>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Why this matters
      </p>
      <ul className="mt-3 space-y-2">
        {clauseWhyItMatters(clause).map((item) => (
          <li className="flex gap-2 text-sm leading-6" key={item}>
            <AlertTriangle
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-warning"
            />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Hazards
      </p>
      <ul className="mt-3 space-y-2">
        {hazards.map((hazard) => (
          <li className="flex gap-2 text-sm leading-6" key={hazard}>
            <AlertTriangle
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-warning"
            />
            <span className="text-muted-foreground">{hazard}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-md border border-border bg-surface/80 p-3">
        <p className="text-sm font-medium text-success">Your role</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Read this clause against your role in the deal and check whether the
          connected section gives the other party extra leverage.
        </p>
      </div>
      <div className="mt-5 rounded-md border border-border bg-surface/80 p-3">
        <p className="text-sm font-medium">Should you sign?</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {clause.risk === "High"
            ? "Do not sign until this clause is reviewed and the practical downside is acceptable."
            : "This may be signable if the wording matches the commercial deal and does not conflict with nearby clauses."}
        </p>
      </div>
    </section>
  );
}

const riskRank: Record<ContractSection["risk"], number> = {
  High: 3,
  Low: 1,
  Medium: 2,
};

function riskBadgeTone(risk: ContractSection["risk"]) {
  if (risk === "High") return "danger";
  if (risk === "Medium") return "warning";
  return "success";
}

function clauseHazards({
  label,
  risk,
}: NonNullable<ReturnType<typeof findContractClause>>["clause"]) {
  if (risk === "High") {
    return [
      `${label} can materially change payment, remedy, or operational leverage.`,
      "The connected section should be reviewed before relying on the summary.",
      "A nearby exception or cross-reference may change the practical result.",
    ];
  }

  if (risk === "Medium") {
    return [
      `${label} can still affect day-to-day performance or negotiation leverage.`,
      "Confirm the clause matches the commercial expectation before signing.",
    ];
  }

  return [
    `${label} appears lower risk, but it can still affect how later clauses are interpreted.`,
  ];
}

function clauseWhyItMatters({
  risk,
  summary,
}: NonNullable<ReturnType<typeof findContractClause>>["clause"]) {
  return [
    summary,
    risk === "High"
      ? "Because this is high risk, it should be checked before the contract is treated as acceptable."
      : "This should be checked against the surrounding section so the contract is interpreted consistently.",
  ];
}

function RightSidebarBreadcrumb({
  clauseLabel,
  onShowSection,
  onShowSummary,
  sectionLabel,
  view,
}: {
  clauseLabel?: string;
  onShowSection: () => void;
  onShowSummary: () => void;
  sectionLabel?: string;
  view: RightSidebarView;
}) {
  return (
    <nav
      aria-label="Right sidebar navigation"
      className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground"
    >
      <button
        className="shrink-0 font-medium uppercase tracking-[0.18em] transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
        onClick={onShowSummary}
        type="button"
      >
        Contract
      </button>
      {view !== "summary" && sectionLabel ? (
        <>
          <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
          <button
            className="min-w-0 truncate font-medium transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
            onClick={onShowSection}
            type="button"
          >
            {sectionLabel}
          </button>
        </>
      ) : null}
      {view === "clause" && clauseLabel ? (
        <>
          <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
          <span className="min-w-0 truncate text-foreground">{clauseLabel}</span>
        </>
      ) : null}
    </nav>
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
      className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary ${
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
