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
import {
  contractOutline,
  findContractClause,
  findContractSection,
} from "../contractOutline";
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
}: ClauseVisualiserProps) {
  const selectedSection = findContractSection(activeSectionId);
  const selectedClause = findContractClause(activeClauseId);

  const nodes = useMemo<Node<FlowNodeData>[]>(() => {
    if (selectedClause) {
      return clauseFlowNodes(selectedClause);
    }

    if (selectedSection) {
      return [
        {
          data: {
            clauses: `${selectedSection.count} clauses`,
            label: selectedSection.label,
            risk: `${selectedSection.risk} risk`,
            tone: riskTone(selectedSection.risk),
          },
          id: selectedSection.id,
          position: { x: 420, y: 20 },
          type: "section",
        },
        ...selectedSection.children.map((clause, index) => ({
          data: {
            clauses: clause.summary,
            label: clause.label,
            risk: `${clause.risk} risk`,
            tone: riskTone(clause.risk),
          },
          id: clause.id,
          position: {
            x: (index % 4) * 280,
            y: Math.floor(index / 4) * 210 + 220,
          },
          type: "section",
        })),
      ];
    }

    return [
      {
        data: {
          clauses: "142 clauses",
          label: "Master Service Agreement",
          risk: "Full contract",
          tone: "neutral",
        },
        id: "agreement",
        position: { x: 420, y: 20 },
        type: "section",
      },
      ...contractOutline.map((section, index) => ({
        data: {
          clauses: `${section.count} clauses`,
          label: section.label,
          risk: `${section.risk} risk`,
          tone: riskTone(section.risk),
        },
        id: section.id,
        position: {
          x: (index % 4) * 280,
          y: Math.floor(index / 4) * 220 + 210,
        },
        type: "section",
      })),
    ];
  }, [selectedClause, selectedSection]);

  const edges = useMemo<Edge[]>(() => {
    if (selectedClause) {
      return clauseFlowEdges(selectedClause.clause.id);
    }

    if (selectedSection) {
      return selectedSection.children.map((clause) => ({
        animated: true,
        id: `${selectedSection.id}-${clause.id}`,
        markerEnd: { type: MarkerType.ArrowClosed },
        source: selectedSection.id,
        target: clause.id,
        type: "smoothstep",
      }));
    }

    return contractOutline.map((section) => ({
      animated: true,
      id: `agreement-${section.id}`,
      markerEnd: { type: MarkerType.ArrowClosed },
      source: "agreement",
      target: section.id,
      type: "smoothstep",
    }));
  }, [selectedClause, selectedSection]);

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
          nodesDraggable={false}
          nodesFocusable
          onNodeClick={(_, node) => {
            const section = findContractSection(node.id);
            const clause = findContractClause(node.id);

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
      className={`min-w-48 rounded-md border bg-surface px-4 py-3 shadow-xl shadow-black/15 ${sectionToneClass[data.tone]}`}
    >
      <Handle className="!bg-border" position={Position.Top} type="target" />
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
        <div className="min-w-0">
          <p className="text-sm font-semibold">{data.label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{data.clauses}</p>
          <p className="mt-1 text-xs font-medium">{data.risk}</p>
        </div>
      </div>
      <Handle className="!bg-border" position={Position.Bottom} type="source" />
    </div>
  );
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

  return [
    {
      data: {
        clauses: `${section.count} clauses`,
        label: section.label,
        risk: `${section.risk} risk section`,
        tone: riskTone(section.risk),
      },
      id: section.id,
      position: { x: 0, y: 170 },
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
      position: { x: 360, y: 40 },
      type: "section",
    },
    {
      data: {
        clauses: "What this clause means in business language.",
        label: "Plain-English meaning",
        risk: "Explanation",
        tone: "accent",
      },
      id: `${clause.id}-plain`,
      position: { x: 360, y: 250 },
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
      position: { x: 720, y: 170 },
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
      position: { x: 720, y: 380 },
      type: "section",
    },
  ];
}

function clauseFlowEdges(clauseId: string): Edge[] {
  return [
    {
      animated: true,
      id: `section-${clauseId}`,
      markerEnd: { type: MarkerType.ArrowClosed },
      source: findContractClause(clauseId)!.section.id,
      target: clauseId,
      type: "smoothstep",
    },
    {
      animated: true,
      id: `${clauseId}-plain`,
      markerEnd: { type: MarkerType.ArrowClosed },
      source: clauseId,
      target: `${clauseId}-plain`,
      type: "smoothstep",
    },
    {
      animated: true,
      id: `${clauseId}-risk`,
      markerEnd: { type: MarkerType.ArrowClosed },
      source: clauseId,
      target: `${clauseId}-risk`,
      type: "smoothstep",
    },
    {
      animated: true,
      id: `${clauseId}-action`,
      markerEnd: { type: MarkerType.ArrowClosed },
      source: `${clauseId}-risk`,
      target: `${clauseId}-action`,
      type: "smoothstep",
    },
  ];
}
