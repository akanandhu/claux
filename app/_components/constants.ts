import type {
  DemoFinding,
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
