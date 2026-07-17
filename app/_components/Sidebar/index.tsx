import { FileUp, FileText, UserRound } from "lucide-react";

import { Button } from "@/components/Button";
import type { SidebarProps } from "./types";

export function Sidebar({ roleLabel }: SidebarProps) {
  return (
    <aside className="border-b border-border bg-surface/85 px-4 py-4 xl:sticky xl:top-0 xl:flex xl:h-screen xl:flex-col xl:border-b-0 xl:border-r xl:px-5 xl:py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 xl:block">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md border border-primary/40 bg-primary/15 text-primary">
            <FileText aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">Claux</p>
            <p className="text-xs text-muted-foreground">
              Contract intelligence
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <Button className="w-full text-foreground hover:text-white" icon={FileUp}>
          Upload legal clause
        </Button>
        <Button className="w-full justify-start text-left" icon={UserRound}>
          {roleLabel}
        </Button>
      </div>
    </aside>
  );
}
