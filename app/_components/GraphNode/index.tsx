import { graphNodeTone } from "../constants";
import type { GraphNodeProps } from "./types";

export function GraphNode({
  isConnected,
  isSelected,
  node,
  onSelectInspector,
}: GraphNodeProps) {
  const tone = graphNodeTone[node.type] ?? graphNodeTone.CLAUSE!;
  const isDimmed = !isSelected && !isConnected;
  const canInspect = Boolean(node.inspectorId);

  function selectNode() {
    if (node.inspectorId) {
      onSelectInspector(node.inspectorId);
    }
  }

  return (
    <g
      aria-label={`${node.label} ${node.type.toLowerCase()}`}
      className={canInspect ? "cursor-pointer outline-none" : ""}
      onClick={selectNode}
      onKeyDown={(event) => {
        if (canInspect && ["Enter", " "].includes(event.key)) {
          event.preventDefault();
          selectNode();
        }
      }}
      role={canInspect ? "button" : "img"}
      tabIndex={canInspect ? 0 : undefined}
    >
      <circle
        cx={node.x}
        cy={node.y}
        fill={tone.fill}
        opacity={isDimmed ? 0.46 : 0.95}
        r={isSelected ? node.size / 2 + 5 : node.size / 2}
        stroke={isSelected ? "#f8fafc" : tone.stroke}
        strokeWidth={isSelected ? 3 : 1.5}
      />
      <circle
        cx={node.x}
        cy={node.y}
        fill="none"
        opacity={isSelected ? 0.55 : 0}
        r={node.size / 2 + 10}
        stroke={tone.stroke}
        strokeWidth="1.5"
      />
      <text
        fill={tone.text}
        fontSize={node.label.length > 11 ? "9" : "11"}
        fontWeight="700"
        pointerEvents="none"
        textAnchor="middle"
        x={node.x}
        y={node.y + 4}
      >
        {node.label}
      </text>
    </g>
  );
}
