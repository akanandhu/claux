import type { InspectorNoteProps } from "./types";

export function InspectorNote({ title, value }: InspectorNoteProps) {
  return (
    <section className="rounded-md border border-border bg-background/55 p-4">
      <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </section>
  );
}
