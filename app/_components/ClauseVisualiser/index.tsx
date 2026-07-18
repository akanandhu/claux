"use client";

import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/Badge";
import { findContractClause, findContractSection } from "@/features/demo/utils";
import { ClauseFlowNode } from "../ClauseFlowNode";
import { hierarchyEdges } from "./layout";
import type { ClauseVisualiserProps, FlowNodeData } from "./types";
import { clauseFlowEdges, clauseFlowNodes, hierarchyNodes, riskTone } from "./utils";

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
          nodeTypes={{ section: ClauseFlowNode }}
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
