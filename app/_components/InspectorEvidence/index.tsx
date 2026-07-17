import { Badge } from "@/components/Badge";
import { formatLabel } from "../format";
import type { InspectorEvidenceProps } from "./types";

export function InspectorEvidence({ inspector }: InspectorEvidenceProps) {
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
            <Badge className="text-[11px]">
              {formatLabel(evidence.validationStatus)}
            </Badge>
          </div>
          <blockquote className="mt-3 border-l-2 border-primary/60 pl-3 font-mono text-xs leading-6 text-foreground">
            {evidence.excerpt}
          </blockquote>
        </article>
      ))}
    </div>
  );
}
