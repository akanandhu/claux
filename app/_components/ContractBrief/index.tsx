import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/Badge";
import type { DemoAnalysisFixture } from "@/features/demo/types";
import type { ContractSection } from "@/features/demo/fixture/outline";
import type { findContractSection } from "@/features/demo/utils";
import { riskBadgeTone, riskRank } from "../ClauseInspectionBar/utils";
import { severityTone } from "../constants";
import { formatLabel } from "../utils";

export function ContractBrief({
  contractSummary,
  contractType,
  onPreviewSection,
  outline,
  selectedSection,
  topFindings,
}: {
  contractSummary: DemoAnalysisFixture["executiveSummary"];
  contractType: string;
  onPreviewSection: (sectionId: string) => void;
  outline: ContractSection[];
  selectedSection: ReturnType<typeof findContractSection>;
  topFindings: DemoAnalysisFixture["topFindings"];
}) {
  const sortedSections = [...outline].sort(
    (left, right) => riskRank[right.risk] - riskRank[left.risk],
  );
  const clauseCount = outline.reduce((total, section) => total + section.count, 0);

  return (
    <section className="rounded-md border border-border bg-background/55 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {selectedSection ? `${selectedSection.label} in short` : "This contract in short"}
      </p>
      <p className="mt-3 text-sm font-medium leading-6">
        {selectedSection
          ? `${selectedSection.label} carries ${selectedSection.risk.toLowerCase()} risk and includes ${selectedSection.count} clauses that should be reviewed together.`
          : `This ${contractType.toLowerCase()} has ${outline.length} detected sections and ${clauseCount} detected clauses.`}
      </p>

      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {selectedSection ? "Things you should know" : "Executive summary"}
      </p>
      <ul className="mt-3 grid gap-2">
        {(selectedSection ? selectedSection.hazards : contractSummary).map((item) => (
          <li
            className="flex items-start gap-2 rounded-md border border-warning/25 bg-warning/10 px-3 py-2 text-sm leading-5"
            key={item}
          >
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-warning"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {!selectedSection && topFindings.length > 0 ? (
        <>
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Review priorities
          </p>
          <div className="mt-3 grid gap-2">
            {topFindings.slice(0, 4).map((finding) => (
              <article
                className="rounded-md border border-border bg-surface/70 px-3 py-2"
                key={finding.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium leading-5">{finding.title}</p>
                  <Badge
                    className="shrink-0"
                    tone={severityTone[finding.severity]}
                  >
                    {finding.severity}
                  </Badge>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {finding.summary}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge
                    tone={
                      finding.validationStatus === "VERIFIED"
                        ? "success"
                        : "warning"
                    }
                  >
                    {finding.validationStatus === "VERIFIED"
                      ? "Evidence verified"
                      : formatLabel(finding.validationStatus)}
                  </Badge>
                  {finding.clauseRefs.length > 0 ? (
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Source: {finding.clauseRefs.join(", ")}
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </>
      ) : null}

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
