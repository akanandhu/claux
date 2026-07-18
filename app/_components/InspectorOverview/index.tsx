import { AlertCircle, CheckCircle2, GitBranch, Link2 } from "lucide-react";

import { Button } from "@/components/Button";
import { severityTone } from "../constants";
import { formatLabel } from "../utils";
import { InspectorCard } from "../InspectorCard";
import { InspectorStat } from "../InspectorStat";
import type { ClauseInspectorProps } from "../ClauseInspector/types";

export function InspectorOverview({
  inspector,
}: {
  inspector: ClauseInspectorProps["inspector"];
}) {
  const condition = inspector.dependencyChain.find((dependency) =>
    dependency.relationship.toLowerCase().includes("condition"),
  );
  const consequence = inspector.dependencyChain.find((dependency) =>
    dependency.relationship.toLowerCase().includes("impact"),
  );

  return (
    <div className="space-y-4">
      <section>
        <h3 className="text-sm font-medium">In simple terms</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {inspector.summary}
        </p>
      </section>

      <dl className="grid grid-cols-3 gap-2">
        <InspectorStat label="Type" value={formatLabel(inspector.nodeType)} />
        <InspectorStat
          label="Risk level"
          tone={inspector.severity ? severityTone[inspector.severity] : undefined}
          value={inspector.severity ?? "INFO"}
        />
        <InspectorStat
          label="Confidence"
          tone="success"
          value={`${Math.round(inspector.confidence * 100)}%`}
        />
      </dl>

      <InspectorCard
        icon={CheckCircle2}
        title="Your obligations"
        value={inspector.keyInfo[0]?.value ?? inspector.commercialImpact}
      />
      <InspectorCard
        icon={GitBranch}
        title="Conditions"
        value={condition?.relationship ?? inspector.uncertainty}
      />
      <InspectorCard
        icon={AlertCircle}
        title="Consequences"
        value={consequence?.relationship ?? inspector.commercialImpact}
      />

      <section>
        <h3 className="text-sm font-medium">
          Connected items ({inspector.dependencyChain.length})
        </h3>
        <div className="mt-3 space-y-2">
          {inspector.dependencyChain.slice(0, 4).map((dependency) => (
            <div
              className="flex items-center justify-between gap-3 text-xs"
              key={dependency.id}
            >
              <span className="truncate text-foreground">{dependency.label}</span>
              <span className="shrink-0 text-muted-foreground">
                {dependency.severity
                  ? dependency.severity.toLowerCase()
                  : "linked"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Button className="w-full" icon={Link2} variant="accent">
        Add to negotiation list
      </Button>
    </div>
  );
}
