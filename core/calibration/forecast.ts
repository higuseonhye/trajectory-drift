import type { DriftAnalysisResult } from "../types";
import type { TrajectoryForecast, WeakSignal } from "./types";

export function forecastTrajectoryInstability(
  analysis: DriftAnalysisResult,
  weakSignals: WeakSignal[],
): TrajectoryForecast {
  const drift = analysis.scores.driftScore;
  const weakWeight = weakSignals.reduce((sum, s) => sum + s.weight, 0);
  const gapCount = analysis.alignment.filter(
    (p) => (p.reference && !p.actual) || (!p.reference && p.actual),
  ).length;

  const rawRisk = Math.min(
    1,
    drift * 0.45 + Math.min(0.35, weakWeight * 0.15) + gapCount * 0.06,
  );

  const instabilityRisk = Math.round(rawRisk * 100) / 100;

  let summary: string;
  if (instabilityRisk >= 0.65) {
    summary =
      "Trajectory continuity is likely to degrade without recalibration. Behavioral adaptation should be applied before extending this run.";
  } else if (instabilityRisk >= 0.35) {
    summary =
      "Early signs of instability are present. Proactive calibration may restore alignment with the reference behavioral model.";
  } else {
    summary =
      "Trajectory appears likely to remain coherent, though continued monitoring of weak signals is advised.";
  }

  return {
    instabilityRisk,
    horizon: instabilityRisk >= 0.5 ? "next_steps" : "end_of_run",
    summary,
  };
}
