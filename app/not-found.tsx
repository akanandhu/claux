import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="flex min-h-screen items-center justify-center px-4 py-10 lg:px-8">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border border-primary/40 bg-primary/15 text-primary">
              <FileQuestion aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">Claux</p>
              <p className="text-xs text-muted-foreground">
                Contract intelligence
              </p>
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
            This workspace route does not exist. Return to the upload screen to
            open a local contract analysis.
          </p>

          <Link
            className="mt-8 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
            href="/"
          >
            <Home aria-hidden="true" className="size-4" />
            Return to workspace
          </Link>
        </div>
      </section>
    </main>
  );
}
