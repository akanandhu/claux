import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { CircleHelp } from "lucide-react";
import { DashboardMetricsPropsI } from "./types";

const DashboardMetrics = ({
  dashboardMetrics,
  metricTone,
}: DashboardMetricsPropsI) => {
  return (
    <TooltipProvider delayDuration={120}>
      <section
        aria-label="Contract metrics"
        className="grid gap-2 md:grid-cols-2 xl:grid-cols-4"
      >
        {dashboardMetrics.map((metric) => (
          <article
            className="min-w-0 rounded-md border border-border bg-surface p-3"
            key={metric.id}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`inline-flex max-w-full rounded-sm border px-2 py-1 text-xs font-medium ${metricTone[metric.tone]}`}
              >
                <span className="truncate">{metric.label}</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    aria-label={`${metric.label}: ${metric.question}`}
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:border-primary/45 hover:bg-surface-raised hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
                    type="button"
                  >
                    <CircleHelp aria-hidden="true" className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium text-foreground">
                    {metric.question}
                  </p>
                  <p className="mt-1 text-muted-foreground">{metric.tip}</p>
                </TooltipContent>
              </Tooltip>
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
    </TooltipProvider>
  );
};

export default DashboardMetrics;
