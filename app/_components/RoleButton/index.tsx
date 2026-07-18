export function RoleButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary ${
        active
          ? "border-primary/70 bg-primary/15 text-foreground"
          : "border-border bg-background/55 text-muted-foreground hover:border-primary/45 hover:text-foreground"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
