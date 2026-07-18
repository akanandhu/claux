import type { InspectorTab } from "../ClauseInspector/types";

export function ClauseInspectorTabButton({
  active,
  onClick,
  tab,
}: {
  active: boolean;
  onClick: () => void;
  tab: InspectorTab;
}) {
  return (
    <button
      aria-selected={active}
      className={`h-9 border-b-2 px-2 text-xs font-medium capitalize transition focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {tab === "dependencies" ? "impact" : tab}
    </button>
  );
}
