import {
  DriftEngine,
  generateDriftReport,
  runCalibration,
  type CalibrationMemory,
  type CalibrationResult,
  type DriftAnalysisResult,
  type DriftReport,
  type Trajectory,
} from "@/core";
import { parseTrajectoryLogs } from "./parse-logs";

export interface IngestionResult {
  reference: Trajectory;
  actual: Trajectory;
  analysis: DriftAnalysisResult;
  report: DriftReport;
  calibration: CalibrationResult;
}

/** Parse logs → detect drift → interpret → recalibrate. */
export async function runIngestionPipeline(
  raw: unknown,
  engine: DriftEngine,
  priorMemory?: CalibrationMemory,
): Promise<IngestionResult> {
  const { reference, actual } = parseTrajectoryLogs(raw);
  const analysis = await engine.analyze(reference, actual);
  const report = generateDriftReport(analysis);
  const calibration = runCalibration(analysis, reference, actual, {
    priorMemory,
  });

  return { reference, actual, analysis, report, calibration };
}

export async function fetchAndIngest(
  url: string,
  engine: DriftEngine,
  priorMemory?: CalibrationMemory,
): Promise<IngestionResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load demo log (${response.status})`);
  }
  const raw = JSON.parse(await response.text()) as unknown;
  return runIngestionPipeline(raw, engine, priorMemory);
}
