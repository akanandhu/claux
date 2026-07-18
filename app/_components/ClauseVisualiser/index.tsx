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
  Brain,
  CheckCircle2,
  GitBranch,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import type { ClauseVisualiserProps } from "./types";

type VisualiserMode = "flow" | "explain";
type FlowTone = "neutral" | "success" | "warning" | "danger" | "accent";

type FlowNodeData = {
  clauses: string;
  label: string;
  risk: string;
  tone: FlowTone;
};

const sectionNodes: Array<FlowNodeData & { id: string; x: number; y: number }> = [
  {
    clauses: "12 clauses",
    id: "definitions",
    label: "Definitions",
    risk: "Low risk",
    tone: "success",
    x: 0,
    y: 0,
  },
  {
    clauses: "17 clauses",
    id: "services",
    label: "Services",
    risk: "Medium risk",
    tone: "warning",
    x: 220,
    y: 0,
  },
  {
    clauses: "12 clauses",
    id: "payment",
    label: "Payment Terms",
    risk: "High risk",
    tone: "danger",
    x: 440,
    y: 0,
  },
  {
    clauses: "11 clauses",
    id: "liability",
    label: "Liability",
    risk: "High risk",
    tone: "danger",
    x: 660,
    y: 0,
  },
  {
    clauses: "10 clauses",
    id: "termination",
    label: "Termination",
    risk: "Medium risk",
    tone: "warning",
    x: 880,
    y: 0,
  },
  {
    clauses: "10 clauses",
    id: "ip",
    label: "Intellectual Property",
    risk: "Medium risk",
    tone: "warning",
    x: 220,
    y: 190,
  },
  {
    clauses: "7 clauses",
    id: "confidentiality",
    label: "Confidentiality",
    risk: "Survives termination",
    tone: "accent",
    x: 440,
    y: 190,
  },
  {
    clauses: "12 clauses",
    id: "general",
    label: "General Provisions",
    risk: "Needs metadata",
    tone: "neutral",
    x: 660,
    y: 190,
  },
];

const sectionEdges: Edge[] = sectionNodes.map((node) => ({
  animated: true,
  id: `agreement-${node.id}`,
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  source: "agreement",
  target: node.id,
  type: "smoothstep",
}));

const sectionToneClass: Record<FlowTone, string> = {
  accent: "border-ai-accent/45 bg-ai-accent/10 text-ai-accent",
  danger: "border-danger/45 bg-danger/10 text-danger",
  neutral: "border-border bg-background text-muted-foreground",
  success: "border-success/45 bg-success/10 text-success",
  warning: "border-warning/45 bg-warning/10 text-warning",
};

const detailNodes: Node<FlowNodeData>[] = [
  {
    data: {
      clauses: "Provider sends invoice",
      label: "Invoice issued",
      risk: "Trigger",
      tone: "accent",
    },
    id: "invoice",
    position: { x: 40, y: 80 },
    type: "section",
  },
  {
    data: {
      clauses: "Payment due within 30 days",
      label: "Due date",
      risk: "Condition",
      tone: "warning",
    },
    id: "due-date",
    position: { x: 300, y: 80 },
    type: "section",
  },
  {
    data: {
      clauses: "Payment not received",
      label: "Late payment",
      risk: "Consequence",
      tone: "danger",
    },
    id: "late-payment",
    position: { x: 560, y: 80 },
    type: "section",
  },
  {
    data: {
      clauses: "2% monthly interest",
      label: "Interest applies",
      risk: "Commercial risk",
      tone: "danger",
    },
    id: "interest",
    position: { x: 560, y: 245 },
    type: "section",
  },
  {
    data: {
      clauses: "Provider may suspend services",
      label: "Termination right",
      risk: "Provider right",
      tone: "warning",
    },
    id: "termination-right",
    position: { x: 820, y: 245 },
    type: "section",
  },
];

const detailEdges: Edge[] = [
  {
    animated: true,
    id: "invoice-due",
    markerEnd: { type: MarkerType.ArrowClosed },
    source: "invoice",
    target: "due-date",
    type: "smoothstep",
  },
  {
    animated: true,
    id: "due-late",
    markerEnd: { type: MarkerType.ArrowClosed },
    source: "due-date",
    target: "late-payment",
    type: "smoothstep",
  },
  {
    animated: true,
    id: "late-interest",
    markerEnd: { type: MarkerType.ArrowClosed },
    source: "late-payment",
    target: "interest",
    type: "smoothstep",
  },
  {
    animated: true,
    id: "interest-termination",
    markerEnd: { type: MarkerType.ArrowClosed },
    source: "interest",
    target: "termination-right",
    type: "smoothstep",
  },
];

export function ClauseVisualiser({
  onSelectInspector,
  selectedInspector,
}: ClauseVisualiserProps) {
  const [mode, setMode] = useState<VisualiserMode>("flow");
  const nodes = useMemo<Node<FlowNodeData>[]>(() => {
    if (mode === "explain") {
      return detailNodes;
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
        position: { x: 440, y: 20 },
        type: "section",
      },
      ...sectionNodes.map((node) => ({
        data: node,
        id: node.id,
        position: { x: node.x, y: node.y + 180 },
        type: "section",
      })),
    ];
  }, [mode]);

  const edges = mode === "flow" ? sectionEdges : detailEdges;

  return (
    <section className="overflow-hidden rounded-md border border-border bg-surface" id="overview">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">
              {mode === "flow" ? "Master Service Agreement" : selectedInspector.title}
            </h2>
            <Badge tone={mode === "flow" ? "primary" : "danger"}>
              {mode === "flow" ? "Flow" : "High risk"}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {mode === "flow"
              ? "General flow of sections and risk areas in this agreement."
              : "Explain how the selected clause connects to obligations and risk."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            icon={GitBranch}
            onClick={() => setMode("flow")}
            size="sm"
            variant={mode === "flow" ? "primary" : "secondary"}
          >
            Flow
          </Button>
          <Button
            icon={Brain}
            onClick={() => setMode("explain")}
            size="sm"
            variant={mode === "explain" ? "primary" : "secondary"}
          >
            Explain
          </Button>
        </div>
      </div>

      {mode === "explain" ? <ExplainSection /> : null}

      <div className="h-[520px] border-t border-border bg-background">
        <ReactFlow
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.22 }}
          nodeTypes={{ section: FlowNode }}
          nodes={nodes}
          nodesDraggable={false}
          nodesFocusable
          onNodeClick={(_, node) => {
            if (node.id === "payment" || node.id === "late-payment") {
              onSelectInspector("liability-cap");
              setMode("explain");
            }
          }}
          panOnScroll
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={18} size={1} />
          <Controls
            className="!border !border-border !bg-surface !shadow-none"
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
      className={`min-w-44 rounded-md border px-4 py-3 shadow-xl shadow-black/15 ${sectionToneClass[data.tone]}`}
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

function ExplainSection() {
  return (
    <div className="grid border-t border-border lg:grid-cols-3">
      <section className="border-b border-border p-4 lg:border-b-0 lg:border-r">
        <h3 className="text-sm font-medium">In simple terms</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          If payment is late, extra charges can apply and the provider may gain
          suspension or termination rights after notice.
        </p>
      </section>
      <section className="border-b border-border p-4 lg:border-b-0 lg:border-r">
        <h3 className="text-sm font-medium">Why this matters</h3>
        <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
          <li>Late payment can increase the amount owed.</li>
          <li>Service access may be interrupted after notice.</li>
          <li>Termination can become possible if default continues.</li>
        </ul>
      </section>
      <section className="p-4">
        <h3 className="text-sm font-medium text-success">Your role</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Customer: pay invoices on time and respond quickly if a notice arrives.
        </p>
      </section>
    </div>
  );
}
