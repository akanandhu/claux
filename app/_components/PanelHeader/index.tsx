import type { PanelHeaderProps } from "./types";

export function PanelHeader({
  action,
  eyebrow,
  icon: Icon,
  title,
}: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-primary">
          <Icon aria-hidden="true" className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="truncate text-base font-semibold">{title}</h2>
        </div>
      </div>
      <span className="shrink-0 rounded-sm border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
        {action}
      </span>
    </div>
  );
}
