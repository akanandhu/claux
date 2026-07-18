import { Badge } from "@/components/Badge";
import type { Party } from "@/schemas/contract";
import { reviewerRoleLabels } from "../WorkspaceShell/constants";
import type { ReviewerRole } from "../WorkspaceShell/types";

export function PartyConfirmationScreen({
  fileName,
  onConfirm,
  parties,
  reviewerRole,
}: {
  fileName: string;
  onConfirm: (partyId: string) => void;
  parties: Party[];
  reviewerRole: ReviewerRole;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen items-center justify-center px-4 py-10 lg:px-8">
        <section className="w-full max-w-2xl rounded-md border border-border bg-surface/80 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Confirm reviewing party
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Which party are you reviewing for?
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Claux extracted clauses from {fileName}. Directional commercial risk
            is blocked until you confirm the party to protect.
          </p>
          <div className="mt-5 grid gap-3">
            {parties.map((party) => (
              <button
                className="flex min-h-14 items-center justify-between gap-3 rounded-md border border-border bg-background/55 px-4 py-3 text-left transition hover:border-primary/45 hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
                key={party.id}
                onClick={() => onConfirm(party.id)}
                type="button"
              >
                <span>
                  <span className="block text-sm font-medium">
                    {party.role ?? party.name}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {party.name}
                  </span>
                </span>
                <Badge tone="primary">
                  {Math.round(party.confidence * 100)}%
                </Badge>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Relationship: {reviewerRoleLabels[reviewerRole].toLowerCase()}.
          </p>
        </section>
      </div>
    </main>
  );
}
