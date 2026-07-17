import { metricTone } from "../constants";
import type { MetricGridProps } from "./types";

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <section
      aria-label="Dashboard metrics"
      className="grid gap-2 md:grid-cols-2 xl:grid-cols-4"
    >
      {metrics.map((metric) => (
        <article
          className="min-w-0 rounded-md border border-border bg-surface p-3"
          key={metric.id}
        >
          <div
            className={`inline-flex max-w-full rounded-sm border px-2 py-1 text-xs font-medium ${metricTone[metric.tone]}`}
          >
            <span className="truncate">{metric.label}</span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-normal">
            {metric.value}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {metric.detail}
          </p>
        </article>
      ))}
    </section>
  );
}
