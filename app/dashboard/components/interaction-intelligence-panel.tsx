"use client";

import type { InteractionGraph, HumanTrajectoryResult } from "@/core";

const ROLE_STYLE = {
  amplifier: "text-emerald-500/90",
  neutral: "text-zinc-500",
  drain: "text-rose-400/90",
};

interface Props {
  humanTrajectory: HumanTrajectoryResult;
}

export function InteractionIntelligencePanel({ humanTrajectory }: Props) {
  const graph: InteractionGraph = humanTrajectory.interactionGraph;

  if (graph.nodes.length === 0) return null;

  return (
    <section className="panel p-6">
      <p className="label-caps">Interaction intelligence</p>
      <p className="mt-2 prose-calm">{graph.observation}</p>
      <ul className="mt-4 space-y-3">
        {graph.nodes.map((n) => (
          <li
            key={n.id}
            className="flex items-center justify-between border-b border-zinc-900 pb-2"
          >
            <span className="text-sm text-zinc-300">{n.label}</span>
            <span
              className={`font-mono text-xs uppercase ${ROLE_STYLE[n.role]}`}
            >
              {n.role} ({n.momentumNet > 0 ? "+" : ""}
              {n.momentumNet})
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
