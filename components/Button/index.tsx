import type { ButtonProps } from "./types";

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary disabled:opacity-50";

const variantClass = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary:
    "border border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-foreground",
  ghost: "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
  accent: "bg-ai-accent text-white hover:bg-ai-accent/90",
  danger:
    "border border-border bg-background text-muted-foreground hover:border-danger/50 hover:text-foreground",
};

const sizeClass = {
  sm: "h-8 px-2 text-xs",
  md: "h-9 px-3 text-sm",
  icon: "size-8 p-0",
};

export function Button({
  children,
  className = "",
  icon: Icon,
  iconOnlyLabel,
  size = "md",
  type = "button",
  variant = "secondary",
  ...props
}: ButtonProps) {
  const label = iconOnlyLabel ?? (typeof children === "string" ? children : undefined);

  return (
    <button
      aria-label={iconOnlyLabel}
      className={`${baseClass} ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      type={type}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" className="size-4" /> : null}
      {children ? children : null}
      {!children && label ? <span className="sr-only">{label}</span> : null}
    </button>
  );
}
