"use client";

import type { CalibrationResult, StabilityLevel } from "@/core";

const STABILITY_LABELS: Record<StabilityLevel, string> = {
  stable: "Stable trajectory",
  unstable: "Unstable trajectory",
  elevated_risk: "Elevated continuity risk",
};

const STABILITY_STYLES: Record<StabilityLevel, string> = {
  stable: "text-emerald-400/90 border-emerald-500/20 bg-emerald-500/5",
  unstable: "text-amber-400/90 border-amber-500/20 bg-amber-500/5",
  elevated_risk: "text-rose-400/80 border-rose-500/20 bg-rose-500/5",
};

interface StabilityPanelProps {
  calibration: CalibrationResult | null;
  loading?: boolean;
}

export function StabilityPanel({ calibration, loading }: StabilityPanelProps) {
  if (loading || !calibration) {
    return (
      <div className="panel flex h-full flex-col justify-center p-6 text-sm text-zinc-500">
        {loading ? "Assessing trajectory continuity…" : "Awaiting calibration."}
      </div>
    );
  }

  const { stabilityLevel, continuityScore, forecast, weakSignals } = calibration;
  const riskPct = Math.round(forecast.instabilityRisk * 100);

  return (
    <div className="panel flex h-full flex-col gap-5 p-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Trajectory continuity
        </p>
        <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-zinc-100">
          {continuityScore}
          <span className="ml-1 text-lg font-normal text-zinc-500">/ 100</span>
        </p>
        <span
          className={`mt-3 inline-block rounded-md border px-2.5 py-1 text-xs font-medium ${STABILITY_STYLES[stabilityLevel]}`}
        >
          {STABILITY_LABELS[stabilityLevel]}
        </span>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Instability forecast
        </p>
        <p className="mt-1 font-mono text-sm text-zinc-300">{riskPct}% risk</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          {forecast.summary}
        </p>
      </div>

      {weakSignals.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Weak signals ({weakSignals.length})
          </p>
          <ul className="max-h-40 space-y-2 overflow-y-auto pr-1">
            {weakSignals.map((signal) => (
              <li
                key={signal.kind}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2"
              >
                <p className="text-[10px] font-medium uppercase tracking-wide text-amber-400/80">
                  {signal.kind.replace(/_/g, " ")}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                  {signal.interpretation}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
