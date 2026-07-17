import type { InspectorHistoryProps } from "./types";

export function InspectorHistory({ inspector }: InspectorHistoryProps) {
  return (
    <div className="space-y-3">
      {inspector.history.map((item) => (
        <article
          className="rounded-md border border-border bg-background/55 p-4"
          key={item.label}
        >
          <p className="text-sm font-medium">{item.label}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.detail}
          </p>
        </article>
      ))}
    </div>
  );
}
