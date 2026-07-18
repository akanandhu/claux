import { MarkerType, type Edge } from "@xyflow/react";

export const branchGap = 260;
export const branchRootY = 220;
export const branchTopY = 35;
export const branchBottomY = 410;

export function branchPositions(childCount: number) {
  const topCount = Math.ceil(childCount / 2);
  const bottomCount = childCount - topCount;
  const rowCount = Math.max(topCount, bottomCount, 1);
  const rootX = ((rowCount - 1) * branchGap) / 2;

  return {
    children: [
      ...rowPositions(rootX, topCount, branchTopY),
      ...rowPositions(rootX, bottomCount, branchBottomY),
    ],
    rootX,
  };
}

export function hierarchyEdges(rootId: string, childIds: string[]): Edge[] {
  const positions = branchPositions(childIds.length);

  return childIds.map((childId, index) => {
    const childPosition = positions.children[index]!;
    const childIsAbove = childPosition.y < branchRootY;

    return {
      animated: true,
      id: `${rootId}-${childId}`,
      markerEnd: { type: MarkerType.ArrowClosed },
      source: rootId,
      sourceHandle: childIsAbove ? "top" : "bottom",
      target: childId,
      targetHandle: childIsAbove ? "bottom" : "top",
      type: "straight",
    };
  });
}

function rowPositions(rootX: number, count: number, y: number) {
  const rowStart = rootX - ((count - 1) * branchGap) / 2;

  return Array.from({ length: count }, (_, index) => ({
    x: rowStart + index * branchGap,
    y,
  }));
}
