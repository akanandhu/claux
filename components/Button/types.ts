import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "accent"
  | "danger";

export type ButtonSize = "sm" | "md" | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  className?: string;
  icon?: LucideIcon;
  iconOnlyLabel?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};
