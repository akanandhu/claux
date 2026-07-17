import { Bell } from "lucide-react";

import { Badge } from "@/components/Badge";
import { severityTone } from "../constants";
import { PanelHeader } from "../PanelHeader";
import type { FindingsPanelProps } from "./types";

export function FindingsPanel({ findings }: FindingsPanelProps) {
  return (
    <section className="rounded-md border border-border bg-surface">
      <PanelHeader
        action={`${findings.length} open`}
        eyebrow="Findings"
        icon={Bell}
        title="Top findings"
      />
      <div className="space-y-3 border-t border-border p-4">
        {findings.map((finding) => (
          <article
            className="rounded-md border border-border bg-background/45 p-3"
            key={finding.id}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium leading-5">{finding.title}</h3>
              <Badge
                className="shrink-0 text-[11px]"
                tone={severityTone[finding.severity]}
              >
                {finding.severity}
              </Badge>
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
  );
}
