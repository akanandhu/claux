import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "accent";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  className?: string;
  tone?: BadgeTone;
};
