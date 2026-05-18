"use client";

import { getCoherenceIndicator, type CalibrationResult } from "@/core";

interface CoherencePanelProps {
  calibration: CalibrationResult | null;
  loading?: boolean;
}

export function CoherencePanel({ calibration, loading }: CoherencePanelProps) {
  if (loading || !calibration) {
    return (
      <div className="panel flex h-full flex-col justify-center p-8">
        <p className="prose-calm">
          {loading ? "Observing…" : "Awaiting trajectory."}
        </p>
      </div>
    );
  }

  const indicator = getCoherenceIndicator(calibration.stabilityLevel);
  const { forecast, contextQuality, observation } = calibration;

  return (
    <div className="panel flex h-full flex-col gap-6 p-6">
      <div>
        <p className="label-caps">Coherence</p>
        <p className="mt-3 text-lg font-medium tracking-tight text-zinc-200">
          {indicator.label}
        </p>
        <p className="mt-2 prose-calm">{indicator.description}</p>
        <p className="mt-4 border-l border-zinc-700 pl-3 text-sm italic text-zinc-500">
          {observation}
        </p>
      </div>

      <div>
        <p className="label-caps">Continuity</p>
        <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
          {calibration.continuityScore}
        </p>
      </div>

      <div>
        <p className="label-caps">Outlook</p>
        <p className="mt-2 prose-calm">{forecast.summary}</p>
      </div>

      {contextQuality.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <p className="label-caps mb-2">Context quality</p>
          <ul className="space-y-3 overflow-y-auto pr-1">
            {contextQuality.map((signal) => (
              <li key={signal.kind} className="border-l border-zinc-700 pl-3">
                <p className="prose-calm">{signal.interpretation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
