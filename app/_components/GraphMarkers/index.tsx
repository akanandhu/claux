import type { GraphMarkerProps } from "./types";

export function GraphMarkers() {
  return (
    <defs>
      <GraphMarker color="#60a5fa" id="arrow-dependency" />
      <GraphMarker color="#f87171" id="arrow-risk" />
      <GraphMarker color="#94a3b8" id="arrow-reference" />
    </defs>
  );
}

function GraphMarker({ color, id }: GraphMarkerProps) {
  return (
    <marker
      id={id}
      markerHeight="8"
      markerWidth="8"
      orient="auto"
      refX="7"
      refY="4"
      viewBox="0 0 8 8"
    >
      <path d="M 0 0 L 8 4 L 0 8 z" fill={color} />
    </marker>
  );
}
