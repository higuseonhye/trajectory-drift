"use client";

import type { HumanTrajectoryResult } from "@/core";

interface Props {
  humanTrajectory: HumanTrajectoryResult;
}

export function HumanTrajectoryPanel({ humanTrajectory }: Props) {
  const { metrics, interventions, summary } = humanTrajectory;

  return (
    <section className="panel p-6">
      <p className="label-caps">Human trajectory</p>
      <p className="mt-1 text-xs text-zinc-600">From trajectory-native bridge</p>
      <p className="mt-3 text-lg font-medium tracking-tight text-zinc-200">
        {summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {metrics.interactionStarvation && (
          <span className="rounded border border-rose-900/50 bg-rose-950/30 px-2 py-0.5 text-xs text-rose-400">
            Interaction starvation
          </span>
        )}
        {metrics.momentumDegrading && (
          <span className="rounded border border-amber-900/50 bg-amber-950/30 px-2 py-0.5 text-xs text-amber-400">
            Momentum degrading
          </span>
        )}
        {!metrics.interactionStarvation && !metrics.momentumDegrading && (
          <span className="rounded border border-zinc-700 px-2 py-0.5 text-xs text-zinc-500">
            Trajectory stable
          </span>
        )}
      </div>
      <p className="mt-4 border-l border-zinc-700 pl-3 text-sm italic text-zinc-500">
        {humanTrajectory.observation}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="label-caps">Momentum</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {metrics.momentumScore}
          </p>
        </div>
        <div>
          <p className="label-caps">Stability</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {metrics.stabilityIndex}
          </p>
        </div>
        <div>
          <p className="label-caps">Open loops</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {metrics.openLoops}
          </p>
        </div>
        <div>
          <p className="label-caps">Events</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {humanTrajectory.eventCount}
          </p>
        </div>
      </div>
      {interventions.length > 0 && (
        <ul className="mt-6 space-y-2">
          {interventions.slice(0, 3).map((s) => (
            <li key={s.kind} className="border-l border-zinc-700 pl-3 text-sm">
              <p className="prose-calm">{s.interpretation}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
