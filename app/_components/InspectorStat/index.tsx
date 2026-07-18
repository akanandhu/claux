import { Badge } from "@/components/Badge";
import type { BadgeTone } from "@/components/Badge/types";

export function InspectorStat({
  label,
  tone,
  value,
}: {
  label: string;
  tone?: BadgeTone;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background/55 p-3">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-2">
        <Badge tone={tone}>{value}</Badge>
      </dd>
    </div>
  );
}
