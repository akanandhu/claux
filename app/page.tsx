import { FileText, Search } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-border bg-surface/80 px-5 py-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md border border-primary/40 bg-primary/15 text-primary">
              <FileText aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-foreground">
                Claux
              </p>
              <p className="text-xs text-muted-foreground">
                Contract intelligence
              </p>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-16 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6">
            <div>
              <p className="text-sm font-medium text-foreground">
                Workspace foundation
              </p>
              <p className="text-xs text-muted-foreground">
                Dark-first contract analysis shell
              </p>
            </div>
            <div className="hidden h-9 min-w-64 items-center gap-2 rounded-md border border-border bg-surface px-3 text-muted-foreground md:flex">
              <Search aria-hidden="true" className="size-4" />
              <span className="text-sm">Search clauses, risks, evidence</span>
            </div>
          </header>

          <div className="grid flex-1 place-items-center px-4 py-10">
            <div className="w-full max-w-3xl rounded-lg border border-border bg-surface p-6 shadow-2xl shadow-black/20">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Visual clone milestone
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-foreground">
                Explainable contract intelligence workspace
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                This foundation replaces the starter screen with the Claux app
                shell and dark theme tokens. Static analysis data, dashboard
                panels, graph interactions, and inspector details will layer on
                in separate commits.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
