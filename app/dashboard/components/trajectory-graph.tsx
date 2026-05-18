"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { TrajectoryGraph } from "@/core";

const KIND_COLORS: Record<string, string> = {
  thought: "#6366f1",
  tool_call: "#f59e0b",
  observation: "#10b981",
  response: "#3b82f6",
  decision: "#a855f7",
};

const DRIFT_COLOR = "#ef4444";

interface TrajectoryGraphViewProps {
  graph: TrajectoryGraph;
  driftStepIds: Set<string>;
  activeStepId?: string | null;
  onStepSelect?: (stepId: string) => void;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  kind: string;
  index: number;
  isDrift: boolean;
}

interface SimLink {
  source: SimNode;
  target: SimNode;
  kind: string;
}

export function TrajectoryGraphView({
  graph,
  driftStepIds,
  activeStepId,
  onStepSelect,
}: TrajectoryGraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl || graph.nodes.length === 0) return;

    const width = container.clientWidth;
    const height = Math.max(320, container.clientHeight || 360);

    const nodes: SimNode[] = graph.nodes.map((n) => ({
      id: n.id,
      label: n.step.label,
      kind: n.step.kind,
      index: n.index,
      isDrift: driftStepIds.has(n.id),
    }));

    const nodeById = new Map(nodes.map((n) => [n.id, n]));

    const links: SimLink[] = [];
    for (const e of graph.edges) {
      const source = nodeById.get(e.from);
      const target = nodeById.get(e.to);
      if (source && target) {
        links.push({ source, target, kind: e.kind });
      }
    }

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

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((l) => ((l as SimLink).kind === "dependency" ? 90 : 70)),
      )
      .force("charge", d3.forceManyBody().strength(-280))
      .force(
        "x",
        d3
          .forceX<SimNode>((d) => 80 + d.index * (width - 160) / Math.max(1, nodes.length - 1))
          .strength(0.85),
      )
      .force("y", d3.forceY(height / 2).strength(0.2))
      .force("collide", d3.forceCollide(36));

    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 22)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#52525b")
      .attr("d", "M0,-5L10,0L0,5");

    const link = g
      .append("g")
      .selectAll<SVGLineElement, SimLink>("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => {
        const srcDrift = (d.source as SimNode).isDrift;
        const tgtDrift = (d.target as SimNode).isDrift;
        return srcDrift || tgtDrift ? DRIFT_COLOR : "#3f3f46";
      })
      .attr("stroke-width", (d) => {
        const srcDrift = (d.source as SimNode).isDrift;
        const tgtDrift = (d.target as SimNode).isDrift;
        return srcDrift || tgtDrift ? 2.5 : 1.5;
      })
      .attr("stroke-dasharray", (d) => (d.kind === "dependency" ? "4 3" : null))
      .attr("marker-end", "url(#arrow)")
      .attr("opacity", 0.9);

    const node = g
      .append("g")
      .selectAll<SVGGElement, SimNode>("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (_, d) => onStepSelect?.(d.id));

    node
      .append("circle")
      .attr("r", (d) => (d.id === activeStepId ? 22 : 18))
      .attr("fill", (d) => {
        if (d.isDrift) return DRIFT_COLOR;
        return KIND_COLORS[d.kind] ?? "#71717a";
      })
      .attr("stroke", (d) => (d.id === activeStepId ? "#fafafa" : "#27272a"))
      .attr("stroke-width", (d) => (d.id === activeStepId ? 3 : 2))
      .attr("class", "transition-all duration-200");

    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 38)
      .attr("fill", "currentColor")
      .attr("class", "fill-zinc-400 text-[10px] font-medium")
      .text((d) => d.label.slice(0, 18) + (d.label.length > 18 ? "…" : ""));

    node.append("title").text((d) => `${d.kind}: ${d.label}`);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      svg.attr("width", w);
      simulation.force(
        "x",
        d3
          .forceX<SimNode>((d) => 80 + d.index * (w - 160) / Math.max(1, nodes.length - 1))
          .strength(0.85),
      );
      simulation.alpha(0.3).restart();
    });
    resizeObserver.observe(container);

    return () => {
      simulation.stop();
      resizeObserver.disconnect();
    };
  }, [graph, driftStepIds, activeStepId, onStepSelect]);

  if (graph.nodes.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        No steps to visualize
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full min-h-[360px] w-full">
      <svg ref={svgRef} className="h-full w-full rounded-lg" />
    </div>
  );
}
