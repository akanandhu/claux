import { metricTone } from "../constants";
import type { MetricGridProps } from "./types";

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <section
      aria-label="Dashboard metrics"
      className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4"
    >
      {metrics.map((metric) => (
        <article
          className="min-h-28 rounded-md border border-border bg-surface p-4"
          key={metric.id}
        >
          <div
            className={`inline-flex rounded-sm border px-2 py-1 text-xs font-medium ${metricTone[metric.tone]}`}
          >
            {metric.label}
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-normal">
            {metric.value}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{metric.detail}</p>
        </article>
      ))}
    </section>
  );
}
