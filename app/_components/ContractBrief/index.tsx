import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/Badge";
import type { ContractSection } from "@/features/demo/fixture/outline";
import type { findContractSection } from "@/features/demo/utils";
import { contractTakeaways } from "../ClauseInspectionBar/constants";
import { riskBadgeTone, riskRank } from "../ClauseInspectionBar/utils";

export function ContractBrief({
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
