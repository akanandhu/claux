import { Handle, Node, Position, type NodeProps } from "@xyflow/react";
import {
  AlertTriangle,
  BookOpenText,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import type { FlowNodeData, FlowTone } from "../ClauseVisualiser/types";

const sectionToneClass: Record<FlowTone, string> = {
  accent: "border-ai-accent/45 text-ai-accent",
  danger: "border-danger/45 text-danger",
  neutral: "border-border text-muted-foreground",
  success: "border-success/45 text-success",
  warning: "border-warning/45 text-warning",
};

export function ClauseFlowNode({ data }: NodeProps<Node<FlowNodeData>>) {
  return (
    <div
      className={`h-24 w-56 overflow-hidden rounded-md border bg-surface px-4 py-3 shadow-xl shadow-black/15 ${sectionToneClass[data.tone]}`}
    >
      <Handle
        className="size-0! border-0! bg-transparent! opacity-0!"
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
