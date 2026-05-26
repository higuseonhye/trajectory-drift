"use client";

import type { HumanTrajectoryResult } from "@/core";

interface Props {
  humanTrajectory: HumanTrajectoryResult;
}

export function EnvironmentalDriftPanel({ humanTrajectory }: Props) {
  const { environmentDrift, interventions } = humanTrajectory;
  const envSignals = interventions.filter(
    (s) => s.kind === "environmental_drift" || s.kind === "awe_deprivation",
  );

  if (environmentDrift.taggedEventCount === 0 && envSignals.length === 0) {
    return null;
  }

  const { deadRatio, deadCount, restorativeCount, indoorLoop, scrollDominance, aweDeprivation } =
    environmentDrift;

  return (
    <section className="panel p-6">
      <p className="label-caps">Environmental drift</p>
      <p className="mt-1 text-xs text-zinc-600">
        Dead atmospheres, sensory deprivation, awe loss — from native bridge
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {deadRatio >= 50 && deadCount >= 2 && (
          <span className="rounded border border-rose-900/50 bg-rose-950/30 px-2 py-0.5 text-xs text-rose-400">
            {deadRatio}% dead atmospheres
          </span>
        )}
        {scrollDominance && (
          <span className="rounded border border-amber-900/50 bg-amber-950/30 px-2 py-0.5 text-xs text-amber-400">
            Scroll / digital numbness
          </span>
        )}
        {indoorLoop && (
          <span className="rounded border border-amber-900/50 bg-amber-950/30 px-2 py-0.5 text-xs text-amber-400">
            Indoor / digital loop
          </span>
        )}
        {aweDeprivation && (
          <span className="rounded border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
            Awe deprivation
          </span>
        )}
        {restorativeCount > 0 && deadCount === 0 && (
          <span className="rounded border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5 text-xs text-emerald-400">
            Restorative contact present
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="label-caps">Dead</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {deadCount}
          </p>
        </div>
        <div>
          <p className="label-caps">Restorative</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {restorativeCount}
          </p>
        </div>
        <div>
          <p className="label-caps">Dead ratio</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {deadRatio}%
          </p>
        </div>
        <div>
          <p className="label-caps">Tagged</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {environmentDrift.taggedEventCount}
          </p>
        </div>
      </div>

      {envSignals.length > 0 && (
        <ul className="mt-6 space-y-3">
          {envSignals.map((s) => (
            <li key={`${s.kind}-${s.interpretation.slice(0, 24)}`} className="border-l border-zinc-700 pl-3 text-sm">
              <p className="prose-calm">{s.interpretation}</p>
              <p className="mt-1 text-xs text-zinc-500">→ {s.suggestedAction}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
