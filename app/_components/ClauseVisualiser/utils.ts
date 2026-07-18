import { MarkerType, type Edge, type Node } from "@xyflow/react";

import { findContractClause } from "@/features/demo/utils";
import {
  branchBottomY,
  branchGap,
  branchRootY,
  branchTopY,
  hierarchyPositions,
  resolveNodeCollisions,
} from "./layout";
import type { FlowNodeData, FlowTone } from "./types";

export function hierarchyNodes(
  root: Node<FlowNodeData>,
  children: Node<FlowNodeData>[],
) {
  const positions = hierarchyPositions(children.length);

  return resolveNodeCollisions([
    {
      ...root,
      position: { x: positions.rootX, y: positions.rootY },
    },
    ...children.map((child, index) => ({
      ...child,
      position: positions.children[index]!,
    })),
  ]);
}

export function riskTone(risk: "Low" | "Medium" | "High"): FlowTone {
  if (risk === "High") return "danger";
  if (risk === "Medium") return "warning";
  return "success";
}

export function clauseFlowNodes(
  selection: NonNullable<ReturnType<typeof findContractClause>>,
): Node<FlowNodeData>[] {
  const { clause, section } = selection;

  return resolveNodeCollisions([
    {
      data: {
        clauses: `${section.count} clauses`,
        label: section.label,
        risk: `${section.risk} risk section`,
        tone: riskTone(section.risk),
      },
      id: section.id,
      position: { x: branchGap, y: branchTopY },
      type: "section",
    },
    {
      data: {
        clauses: clause.summary,
        label: clause.label,
        risk: `${clause.risk} risk clause`,
        tone: riskTone(clause.risk),
      },
      id: clause.id,
      position: { x: branchGap, y: branchRootY },
      type: "section",
    },
    {
      data: {
        clauses: "Review the commercial effect before signing.",
        label: "Risk factor",
        risk: `${clause.risk} priority`,
        tone: riskTone(clause.risk),
      },
      id: `${clause.id}-risk`,
      position: { x: 0, y: branchBottomY },
      type: "section",
    },
    {
      data: {
        clauses: "Confirm the clause matches your role and the connected terms.",
        label: "Before signing",
        risk: "Action",
        tone: "neutral",
      },
      id: `${clause.id}-action`,
      position: { x: branchGap * 2, y: branchBottomY },
      type: "section",
    },
  ]);
}

export function clauseFlowEdges(
  selection: NonNullable<ReturnType<typeof findContractClause>>,
): Edge[] {
  const { clause, section } = selection;

  return [
    {
      animated: true,
      id: `section-${clause.id}`,
      markerEnd: { type: MarkerType.ArrowClosed },
      source: section.id,
      target: clause.id,
      type: "smoothstep",
    },
    {
      animated: true,
      id: `${clause.id}-risk`,
      markerEnd: { type: MarkerType.ArrowClosed },
      source: clause.id,
      target: `${clause.id}-risk`,
      type: "smoothstep",
    },
    {
      animated: true,
      id: `${clause.id}-action`,
      markerEnd: { type: MarkerType.ArrowClosed },
      source: `${clause.id}-risk`,
      target: `${clause.id}-action`,
      type: "smoothstep",
    },
  ];
}
