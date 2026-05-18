import type { DriftAnalysisResult, Trajectory } from "../types";
import { forecastTrajectoryInstability } from "./forecast";
import {
  createEmptyMemory,
  inferStabilized,
  memoryContextNote,
  recordCalibrationEvent,
} from "./memory";
import { buildCalibrationInsights, buildGlobalSummary } from "./interpret";
import { detectWeakSignals } from "./weak-signals";
import type {
  CalibrationMemory,
  CalibrationResult,
  StabilityLevel,
} from "./types";

function resolveStabilityLevel(
  driftScore: number,
  weakSignalWeight: number,
  forecastRisk: number,
): StabilityLevel {
  const composite = driftScore * 0.5 + weakSignalWeight * 0.25 + forecastRisk * 0.25;
  if (composite >= 0.55) return "elevated_risk";
  if (composite >= 0.28) return "unstable";
  return "stable";
}

export interface RunCalibrationOptions {
  priorMemory?: CalibrationMemory;
}

export function runCalibration(
  analysis: DriftAnalysisResult,
  reference: Trajectory,
  actual: Trajectory,
  options: RunCalibrationOptions = {},
): CalibrationResult {
  const priorMemory = options.priorMemory ?? createEmptyMemory();
  const weakSignals = detectWeakSignals(actual, reference);
  const forecast = forecastTrajectoryInstability(analysis, weakSignals);
  const insights = buildCalibrationInsights(analysis);

  const weakWeight = Math.min(
    1,
    weakSignals.reduce((s, w) => s + w.weight, 0),
  );
  const stabilityLevel = resolveStabilityLevel(
    analysis.scores.driftScore,
    weakWeight,
    forecast.instabilityRisk,
  );

  const continuityScore = Math.round(
    (1 - analysis.scores.driftScore) * (1 - forecast.instabilityRisk * 0.5) * 100,
  );

  const corrections = insights.flatMap((i) =>
    i.suggestedCalibration.map((c) => c.label),
  );
  const driftKinds = [...new Set(analysis.issues.map((i) => i.kind))];
  const stabilized = inferStabilized(
    stabilityLevel,
    priorMemory,
    analysis.actualTrajectoryId,
  );

  const memory = recordCalibrationEvent(priorMemory, {
    actualTrajectoryId: analysis.actualTrajectoryId,
    stabilityLevel,
    driftKinds,
    corrections,
    stabilized,
  });

  const memoryNote = memoryContextNote(memory);
  const globalSummary = buildGlobalSummary(
    analysis,
    insights.length,
    weakSignals.length,
    memoryNote,
  );

  return {
    stabilityLevel,
    continuityScore,
    weakSignals,
    forecast,
    insights,
    globalSummary,
    memory,
  };
}
