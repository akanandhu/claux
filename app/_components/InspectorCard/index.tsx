import type { LucideIcon } from "lucide-react";

export function InspectorCard({
  icon: Icon,
  title,
  value,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
}) {
  return (
    <section className="rounded-md border border-border bg-background/55 p-4">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="size-4 text-primary" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{value}</p>
    </section>
  );
}
