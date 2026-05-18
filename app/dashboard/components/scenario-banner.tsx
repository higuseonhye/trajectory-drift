"use client";

import type { CalibrationResult } from "@/core";

interface ScenarioBannerProps {
  calibration: CalibrationResult;
}

export function ScenarioBanner({ calibration }: ScenarioBannerProps) {
  return (
    <div className="panel border-blue-500/15 bg-blue-500/[0.03] px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400/80">
            Calibration scenario
          </p>
          <h2 className="mt-0.5 text-sm font-medium text-zinc-200">
            Support agent — grounding under uncertainty
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-500">
            Reference trajectory maintains retrieval grounding and validation.
            Live run shows retrieval avoidance, weak-signal precursors, and
            behavioral drift — requiring adaptive recalibration.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center">
          <p className="text-lg font-semibold tabular-nums text-zinc-200">
            {calibration.continuityScore}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-zinc-600">
            continuity
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-zinc-500">
        {calibration.forecast.summary}
      </p>
    </div>
  );
}
