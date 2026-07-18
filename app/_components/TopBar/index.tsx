import { Bot, Download, GitBranch, Search, Settings } from "lucide-react";

import { Button } from "@/components/Button";
import type { TopBarProps } from "./types";

export function TopBar({}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-4 backdrop-blur lg:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <label className="relative min-w-0 sm:w-72">
            <span className="sr-only">Search clauses, risks, evidence</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              className="h-9 w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25"
              placeholder="Search clauses, risks, evidence"
              type="search"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Button icon={GitBranch}>Compare</Button>
            <Button icon={Download}>Export</Button>
            <Button icon={Settings} iconOnlyLabel="Settings" size="icon" />
            <Button icon={Bot} variant="primary">
              Ask
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
