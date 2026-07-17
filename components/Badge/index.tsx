import type { BadgeProps } from "./types";

const toneClass = {
  neutral: "border-border bg-background text-muted-foreground",
  primary: "border-primary/30 bg-primary/10 text-primary",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  accent: "border-ai-accent/30 bg-ai-accent/10 text-ai-accent",
};

export function Badge({
  children,
  className = "",
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-xs font-medium ${toneClass[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
