import { AlertTriangle } from "lucide-react";

import type { JobStage } from "../WorkspaceShell/types";

export function WorkspaceStatusBanner({ stage }: { stage: JobStage }) {
  if (stage !== "partial") return null;

  return (
    <section
      aria-live="polite"
      className="border-b border-warning/30 bg-warning/10 px-4 py-3 text-warning lg:px-6"
      role="status"
    >
      <div className="flex items-start gap-2 text-sm leading-6">
        <AlertTriangle
          aria-hidden="true"
          className="mt-1 size-4 shrink-0"
        />
        <p>
          Partial analysis: Claux could not confirm a reviewing party, so
          directional commercial-risk guidance is withheld.
        </p>
      </div>
    </section>
  );
}
