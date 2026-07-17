import { Maximize2, Minus, MousePointer2, Plus } from "lucide-react";

import { Button } from "@/components/Button";
import { graphLegend } from "../constants";

export function GraphToolbar() {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {graphLegend.map((item) => (
          <span
            className="inline-flex items-center gap-2 text-xs text-muted-foreground"
            key={item.label}
          >
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button icon={Minus} iconOnlyLabel="Zoom out" size="icon" />
        <Button icon={Plus} iconOnlyLabel="Zoom in" size="icon" />
        <Button icon={Maximize2} iconOnlyLabel="Fit graph" size="icon" />
        <Button icon={MousePointer2} iconOnlyLabel="Select mode" size="icon" />
      </div>
    </div>
  );
}
