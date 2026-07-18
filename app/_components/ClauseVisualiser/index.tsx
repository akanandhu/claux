"use client";

import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import {
  AlertTriangle,
  BookOpenText,
  CheckCircle2,
  GitBranch,
  ShieldAlert,
} from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/Badge";
import { findContractClause, findContractSection } from "../contractOutline";
import {
  branchBottomY,
  branchGap,
  branchRootY,
  branchTopY,
  hierarchyPositions,
  hierarchyEdges,
  resolveNodeCollisions,
} from "./layout";
import type { ClauseVisualiserProps } from "./types";

type FlowTone = "neutral" | "success" | "warning" | "danger" | "accent";

type FlowNodeData = {
  clauses: string;
  label: string;
  risk: string;
  tone: FlowTone;
};

const sectionToneClass: Record<FlowTone, string> = {
  accent: "border-ai-accent/45 text-ai-accent",
  danger: "border-danger/45 text-danger",
  neutral: "border-border text-muted-foreground",
  success: "border-success/45 text-success",
  warning: "border-warning/45 text-warning",
};

export function ClauseVisualiser({
  activeClauseId,
  activeSectionId,
  onSelectClause,
  onSelectSection,
  outline,
}: ClauseVisualiserProps) {
  const selectedSection = findContractSection(activeSectionId, outline);
  const selectedClause = findContractClause(activeClauseId, outline);

  const nodes = useMemo<Node<FlowNodeData>[]>(() => {
    if (selectedClause) {
      return clauseFlowNodes(selectedClause);
    }

    if (selectedSection) {
      return hierarchyNodes(
        {
          data: {
            clauses: `${selectedSection.count} clauses`,
            label: selectedSection.label,
            risk: `${selectedSection.risk} risk`,
            tone: riskTone(selectedSection.risk),
          },
          id: selectedSection.id,
          position: { x: 0, y: 0 },
          type: "section",
        },
        selectedSection.children.map((clause) => ({
          data: {
            clauses: clause.summary,
            label: clause.label,
            risk: `${clause.risk} risk`,
            tone: riskTone(clause.risk),
          },
          id: clause.id,
          position: { x: 0, y: 0 },
          type: "section",
        })),
      );
    }

    return hierarchyNodes(
      {
        data: {
          clauses: "142 clauses",
          label: "Master Service Agreement",
          risk: "Full contract",
          tone: "neutral",
        },
        id: "agreement",
        position: { x: 0, y: 0 },
        type: "section",
      },
      outline.map((section) => ({
        data: {
          clauses: `${section.count} clauses`,
          label: section.label,
          risk: `${section.risk} risk`,
          tone: riskTone(section.risk),
        },
        id: section.id,
        position: { x: 0, y: 0 },
        type: "section",
      })),
    );
  }, [outline, selectedClause, selectedSection]);

  const edges = useMemo<Edge[]>(() => {
    if (selectedClause) {
      return clauseFlowEdges(selectedClause);
    }

    if (selectedSection) {
      return hierarchyEdges(
        selectedSection.id,
        selectedSection.children.map((clause) => clause.id),
      );
    }

    return hierarchyEdges(
      "agreement",
      outline.map((section) => section.id),
    );
  }, [outline, selectedClause, selectedSection]);

  const visualiserTitle =
    selectedClause?.clause.label ??
    selectedSection?.label ??
    "Master Service Agreement";

  return (
    <section className="overflow-hidden rounded-md border border-border bg-surface" id="overview">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">{visualiserTitle}</h2>
            <Badge tone="primary">Flow</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            General flow of sections, clauses, and connected risk areas in this
            agreement.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex h-8 items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 text-xs font-medium text-primary">
            <GitBranch aria-hidden="true" className="size-4" />
            Flow
          </div>
        </div>
      </div>

      <div className="h-[520px] border-t border-border bg-background">
        <ReactFlow
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.22 }}
          key={`${activeSectionId ?? "contract"}-${activeClauseId ?? "all"}`}
          nodeTypes={{ section: FlowNode }}
          nodes={nodes}
          nodesConnectable={false}
          nodesDraggable={false}
          nodesFocusable
          onNodeClick={(_, node) => {
            const section = findContractSection(node.id, outline);
            const clause = findContractClause(node.id, outline);

            if (section) {
              onSelectSection(section.id);
              return;
            }

            if (clause) {
              onSelectClause(clause.clause.id, clause.section.id);
            }
          }}
          panOnScroll
          proOptions={{ hideAttribution: true }}
          zoomOnDoubleClick={false}
        >
          <Background color="#334155" gap={18} size={1} />
          <Controls
            className="clause-flow-controls !border !border-border !bg-surface !shadow-none"
            showInteractive={false}
          />
        </ReactFlow>
      </div>
    </section>
  );
}

function FlowNode({ data }: NodeProps<Node<FlowNodeData>>) {
  return (
    <div
      className={`h-24 w-56 overflow-hidden rounded-md border bg-surface px-4 py-3 shadow-xl shadow-black/15 ${sectionToneClass[data.tone]}`}
    >
      <Handle
        className="!size-0 !border-0 !bg-transparent !opacity-0"
        id="top"
        isConnectable={false}
        position={Position.Top}
        type="target"
      />
      <Handle
        className="!size-0 !border-0 !bg-transparent !opacity-0"
        id="top"
        isConnectable={false}
        position={Position.Top}
        type="source"
      />
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm border border-current/30 bg-background/55">
          {data.tone === "danger" ? (
            <ShieldAlert aria-hidden="true" className="size-4" />
          ) : data.tone === "success" ? (
            <CheckCircle2 aria-hidden="true" className="size-4" />
          ) : data.tone === "warning" ? (
            <AlertTriangle aria-hidden="true" className="size-4" />
          ) : (
            <BookOpenText aria-hidden="true" className="size-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{data.label}</p>
          <p className="mt-1 overflow-hidden text-xs text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {data.clauses}
          </p>
          <p className="mt-1 truncate text-xs font-medium">{data.risk}</p>
        </div>
      </div>
      <Handle
        className="!size-0 !border-0 !bg-transparent !opacity-0"
        id="bottom"
        isConnectable={false}
        position={Position.Bottom}
        type="source"
      />
      <Handle
        className="!size-0 !border-0 !bg-transparent !opacity-0"
        id="bottom"
        isConnectable={false}
        position={Position.Bottom}
        type="target"
      />
    </div>
  );
}

function hierarchyNodes(
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

function riskTone(risk: "Low" | "Medium" | "High"): FlowTone {
  if (risk === "High") return "danger";
  if (risk === "Medium") return "warning";
  return "success";
}

function clauseFlowNodes(
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

function clauseFlowEdges(
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
