"use client";

import type { CalibrationResult } from "@/core";
import { getCoherenceIndicator } from "@/core";

interface ScenarioBannerProps {
  calibration: CalibrationResult;
  scenarioTitle?: string;
  coordinationSummary?: string;
}

export function ScenarioBanner({
  calibration,
  scenarioTitle = "Support agent · grounding under uncertainty",
  coordinationSummary,
}: ScenarioBannerProps) {
  const indicator = getCoherenceIndicator(calibration.stabilityLevel);

  return (
    <div className="panel-ghost border-b border-[var(--border-subtle)] px-1 py-4">
      <p className="label-caps">Active run</p>
      <p className="mt-2 text-sm text-zinc-300">{scenarioTitle}</p>
      {coordinationSummary && (
        <p className="mt-1 text-xs text-zinc-600">{coordinationSummary}</p>
      )}
      <p className="mt-2 max-w-2xl prose-calm">
        {indicator.label}. {calibration.forecast.summary}
      </p>
      <p className="mt-3 text-sm italic text-zinc-600">
        {calibration.observation}
      </p>
    </div>
  );
}
