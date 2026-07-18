import { MarkerType, type Edge, type Node } from "@xyflow/react";

export const branchGap = 260;
export const branchRootY = 220;
export const branchTopY = 35;
export const branchBottomY = 410;
export const visualNodeHeight = 96;
export const visualNodeWidth = 224;

const simpleChildLimit = 4;
const simpleRootY = 35;
const simpleChildY = 290;
const collisionOptions = {
  margin: 22,
  maxIterations: 50,
  overlapThreshold: 0.5,
};

export type CollisionAlgorithmOptions = {
  maxIterations: number;
  overlapThreshold: number;
  margin: number;
};

export type CollisionAlgorithm = <T extends Node>(
  nodes: T[],
  options: CollisionAlgorithmOptions,
) => T[];

type Box<T extends Node = Node> = {
  height: number;
  moved: boolean;
  node: T;
  width: number;
  x: number;
  y: number;
};

function getBoxesFromNodes<T extends Node>(nodes: T[], margin = 0): Box<T>[] {
  const boxes: Box<T>[] = new Array(nodes.length);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!;
    boxes[i] = {
      height: (node.height ?? node.measured?.height ?? visualNodeHeight) + margin * 2,
      moved: false,
      node,
      width: (node.width ?? node.measured?.width ?? visualNodeWidth) + margin * 2,
      x: node.position.x - margin,
      y: node.position.y - margin,
    };
  }

  return boxes;
}

export const resolveCollisions: CollisionAlgorithm = (
  nodes,
  { maxIterations = 50, overlapThreshold = 0.5, margin = 0 },
) => {
  const boxes = getBoxesFromNodes(nodes, margin);

  for (let iter = 0; iter <= maxIterations; iter++) {
    let moved = false;

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const first = boxes[i]!;
        const second = boxes[j]!;
        const centerFirstX = first.x + first.width * 0.5;
        const centerFirstY = first.y + first.height * 0.5;
        const centerSecondX = second.x + second.width * 0.5;
        const centerSecondY = second.y + second.height * 0.5;
        const dx = centerFirstX - centerSecondX;
        const dy = centerFirstY - centerSecondY;
        const px = (first.width + second.width) * 0.5 - Math.abs(dx);
        const py = (first.height + second.height) * 0.5 - Math.abs(dy);

        if (px > overlapThreshold && py > overlapThreshold) {
          first.moved = true;
          second.moved = true;
          moved = true;

          if (px < py) {
            const sx = dx > 0 ? 1 : -1;
            const moveAmount = (px / 2) * sx;
            first.x += moveAmount;
            second.x -= moveAmount;
          } else {
            const sy = dy > 0 ? 1 : -1;
            const moveAmount = (py / 2) * sy;
            first.y += moveAmount;
            second.y -= moveAmount;
          }
        }
      }
    }

    if (!moved) break;
  }

  return boxes.map((box) => {
    if (!box.moved) return box.node;

    return {
      ...box.node,
      position: {
        x: box.x + margin,
        y: box.y + margin,
      },
    };
  });
};

export function hierarchyPositions(childCount: number) {
  if (childCount <= simpleChildLimit) {
    return simplePositions(childCount);
  }

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
    rootY: branchRootY,
  };
}

export function hierarchyEdges(rootId: string, childIds: string[]): Edge[] {
  const positions = hierarchyPositions(childIds.length);

  return childIds.map((childId, index) => {
    const childPosition = positions.children[index]!;
    const childIsAbove = childPosition.y < positions.rootY;

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

export function resolveNodeCollisions<T extends Node>(nodes: T[]) {
  return resolveCollisions(nodes, collisionOptions);
}

function simplePositions(childCount: number) {
  const rootX = ((childCount - 1) * branchGap) / 2;

  return {
    children: rowPositions(rootX, childCount, simpleChildY),
    rootX,
    rootY: simpleRootY,
  };
}

function rowPositions(rootX: number, count: number, y: number) {
  const rowStart = rootX - ((count - 1) * branchGap) / 2;

  return Array.from({ length: count }, (_, index) => ({
    x: rowStart + index * branchGap,
    y,
  }));
}
