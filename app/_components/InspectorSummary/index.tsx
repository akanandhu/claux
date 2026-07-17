import { WandSparkles } from "lucide-react";

import { Button } from "@/components/Button";
import { InspectorNote } from "../InspectorNote";
import type { InspectorSummaryProps } from "./types";

export function InspectorSummary({ inspector }: InspectorSummaryProps) {
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
        <Button className="mt-4" icon={WandSparkles} variant="accent">
          Draft suggested action
        </Button>
      </div>
    </div>
  );
}
