import type {
  DemoFinding,
  DemoGraphEdge,
  DemoGraphNode,
  DemoMetric,
  PresentationLabel,
} from "@/features/demo/types";
import type { BadgeTone } from "@/components/Badge/types";

export const metricTone: Record<DemoMetric["tone"], string> = {
  neutral: "border-border bg-surface-raised text-foreground",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  accent: "border-ai-accent/30 bg-ai-accent/10 text-ai-accent",
};

export const severityTone: Record<DemoFinding["severity"], BadgeTone> = {
  INFO: "primary",
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
  CRITICAL: "danger",
};

export const severityClass: Record<DemoFinding["severity"], string> = {
  INFO: "border-primary/30 bg-primary/10 text-primary",
  LOW: "border-success/30 bg-success/10 text-success",
  MEDIUM: "border-warning/30 bg-warning/10 text-warning",
  HIGH: "border-danger/30 bg-danger/10 text-danger",
  CRITICAL: "border-danger bg-danger/20 text-danger",
};

export const labelClass: Record<PresentationLabel, string> = {
  FACT: "border-primary/30 bg-primary/10 text-primary",
  STRUCTURAL_DIAGNOSTIC: "border-primary/30 bg-primary/10 text-primary",
  CONTRACT_SMELL: "border-warning/30 bg-warning/10 text-warning",
  COMMERCIAL_RISK: "border-danger/30 bg-danger/10 text-danger",
  LEGAL_REVIEW_SIGNAL: "border-warning/30 bg-warning/10 text-warning",
  NEGOTIATION_SUGGESTION: "border-ai-accent/30 bg-ai-accent/10 text-ai-accent",
  UNCERTAIN: "border-border bg-surface-raised text-muted-foreground",
};

export const graphNodeTone: Partial<
  Record<DemoGraphNode["type"], { fill: string; stroke: string; text: string }>
> = {
  CLAUSE: { fill: "#2563eb", stroke: "#93c5fd", text: "#dbeafe" },
  OBLIGATION: { fill: "#7c3aed", stroke: "#c4b5fd", text: "#ede9fe" },
  RIGHT: { fill: "#22c55e", stroke: "#86efac", text: "#dcfce7" },
  CONDITION: { fill: "#f59e0b", stroke: "#fcd34d", text: "#fef3c7" },
  PARTY: { fill: "#14b8a6", stroke: "#5eead4", text: "#ccfbf1" },
  FINDING: { fill: "#ef4444", stroke: "#fca5a5", text: "#fee2e2" },
  CONTRACT: { fill: "#1f2937", stroke: "#94a3b8", text: "#f8fafc" },
};

export const graphLegend = [
  { label: "Clause", color: "#2563eb" },
  { label: "Obligation", color: "#7c3aed" },
  { label: "Right", color: "#22c55e" },
  { label: "Condition", color: "#f59e0b" },
  { label: "Party", color: "#14b8a6" },
  { label: "Risk", color: "#ef4444" },
];

export function edgeColor(pathType: DemoGraphEdge["pathType"]) {
  if (pathType === "risk") return "#f87171";
  if (pathType === "reference") return "#94a3b8";
  return "#60a5fa";
}
