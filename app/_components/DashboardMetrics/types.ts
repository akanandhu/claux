export type DemoMetric = {
  detail: string;
  id: string;
  label: string;
  question: string;
  tone: string;
  value: string;
  tip: string;
};

export type DashboardMetricsPropsI = {
  dashboardMetrics: DemoMetric[];
  metricTone: Record<DemoMetric["tone"], string>;
};
