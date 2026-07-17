import { Badge } from "@/components/Badge";
import { severityTone } from "../constants";
import type { InspectorDependenciesProps } from "./types";

export function InspectorDependencies({
  inspector,
}: InspectorDependenciesProps) {
  return (
    <div className="space-y-3">
      {inspector.dependencyChain.map((dependency, index) => (
        <article
          className="rounded-md border border-border bg-background/55 p-4"
          key={dependency.id}
        >
          <div className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-border bg-surface font-mono text-xs text-muted-foreground">
              {index + 1}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-medium">{dependency.label}</h3>
                {dependency.severity ? (
                  <Badge
                    className="py-0.5 text-[11px]"
                    tone={severityTone[dependency.severity]}
                  >
                    {dependency.severity}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {dependency.relationship}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
