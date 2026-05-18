"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { AgentLane, HandoffRecord } from "@/core";

const KIND_COLORS: Record<string, string> = {
  thought: "#6366f1",
  tool_call: "#f59e0b",
  observation: "#10b981",
  response: "#3b82f6",
  decision: "#a855f7",
};

interface MultiLaneGraphProps {
  lanes: AgentLane[];
  handoffs: HandoffRecord[];
  activeStepId?: string | null;
  onStepSelect?: (stepId: string) => void;
}

interface LaneNode {
  id: string;
  laneIndex: number;
  stepIndex: number;
  label: string;
  kind: string;
  agentId: string;
}

export function MultiLaneGraph({
  lanes,
  handoffs,
  activeStepId,
  onStepSelect,
}: MultiLaneGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl || lanes.length === 0) return;

    const width = container.clientWidth;
    const laneHeight = 100;
    const padding = { top: 40, left: 120, right: 40, bottom: 24 };
    const height =
      padding.top + padding.bottom + lanes.length * laneHeight;

    const nodes: LaneNode[] = [];
    lanes.forEach((lane, laneIndex) => {
      lane.steps.forEach((step, stepIndex) => {
        nodes.push({
          id: step.id,
          laneIndex,
          stepIndex,
          label: step.label,
          kind: step.kind,
          agentId: lane.agentId,
        });
      });
    });

    const maxSteps = Math.max(1, ...lanes.map((l) => l.steps.length));
    const xScale = (stepIndex: number) =>
      padding.left +
      (stepIndex * (width - padding.left - padding.right)) /
        Math.max(1, maxSteps - 1);

    const yScale = (laneIndex: number) =>
      padding.top + laneIndex * laneHeight + laneHeight / 2;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#111113")
      .attr("rx", 8);

    const g = svg.append("g");

    lanes.forEach((lane, i) => {
      const y = yScale(i);
      g.append("line")
        .attr("x1", padding.left - 8)
        .attr("x2", width - padding.right)
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke", "#27272a")
        .attr("stroke-dasharray", "4 4");

      g.append("text")
        .attr("x", 12)
        .attr("y", y + 4)
        .attr("fill", "#a1a1aa")
        .attr("font-size", 11)
        .text(lane.label.slice(0, 14));
    });

    handoffs.forEach((h) => {
      const fromLane = lanes.findIndex((l) => l.agentId === h.fromAgentId);
      const toLane = lanes.findIndex((l) => l.agentId === h.toAgentId);
      if (fromLane < 0 || toLane < 0) return;

      const fromSteps = lanes[fromLane].steps;
      const toSteps = lanes[toLane].steps;
      const fromStep =
        fromSteps.find((s) => s.id === h.stepId) ??
        fromSteps[fromSteps.length - 1];
      const toStep = toSteps[0];
      if (!fromStep || !toStep) return;

      const fromIdx = fromSteps.indexOf(fromStep);
      const toIdx = toSteps.indexOf(toStep);

      g.append("path")
        .attr(
          "d",
          `M ${xScale(fromIdx)} ${yScale(fromLane)} Q ${(xScale(fromIdx) + xScale(toIdx)) / 2} ${(yScale(fromLane) + yScale(toLane)) / 2} ${xScale(toIdx)} ${yScale(toLane)}`,
        )
        .attr("fill", "none")
        .attr("stroke", "#52525b")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "5 3")
        .attr("marker-end", "url(#handoff-arrow)");
    });

    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "handoff-arrow")
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 6)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#71717a")
      .attr("d", "M0,-4L8,0L0,4");

    const node = g
      .selectAll<SVGGElement, LaneNode>("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr("cursor", "pointer")
      .attr(
        "transform",
        (d) => `translate(${xScale(d.stepIndex)},${yScale(d.laneIndex)})`,
      )
      .on("click", (_, d) => onStepSelect?.(d.id));

    node
      .append("circle")
      .attr("r", (d) => (d.id === activeStepId ? 16 : 13))
      .attr("fill", (d) => KIND_COLORS[d.kind] ?? "#71717a")
      .attr("stroke", (d) => (d.id === activeStepId ? "#fafafa" : "#3f3f46"))
      .attr("stroke-width", (d) => (d.id === activeStepId ? 2.5 : 1.5));

    node
      .append("text")
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("fill", "#a1a1aa")
      .attr("font-size", 9)
      .text((d) => d.label.slice(0, 12) + (d.label.length > 12 ? "…" : ""));

    node.append("title").text((d) => `${d.agentId}: ${d.label}`);
  }, [lanes, handoffs, activeStepId, onStepSelect]);

  if (lanes.every((l) => l.steps.length === 0)) {
    return (
      <p className="flex min-h-[200px] items-center justify-center prose-calm">
        No lane data for this run.
      </p>
    );
  }

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg ref={svgRef} className="min-w-full rounded-lg" />
    </div>
  );
}
