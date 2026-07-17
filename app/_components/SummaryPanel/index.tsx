import { FileText } from "lucide-react";

import { PanelHeader } from "../PanelHeader";
import type { SummaryPanelProps } from "./types";

export function SummaryPanel({ items }: SummaryPanelProps) {
  return (
    <section className="rounded-md border border-border bg-surface">
      <PanelHeader
        action={`${items.length} notes`}
        eyebrow="Summary"
        icon={FileText}
        title="Executive summary"
      />
      <div className="space-y-3 border-t border-border p-4">
        {items.map((item) => (
          <p
            className="rounded-md border border-border bg-background/45 p-3 text-sm leading-6 text-muted-foreground"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
