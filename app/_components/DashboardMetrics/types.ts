import type { DemoMetric } from "@/features/demo/types";

export type DashboardMetricTone = NonNullable<DemoMetric["tone"]>;

export type DashboardMetricsProps = {
  dashboardMetrics: DemoMetric[];
  metricTone: Record<DashboardMetricTone, string>;
};
