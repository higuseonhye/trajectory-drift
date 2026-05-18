import {
  DriftEngine,
  generateDriftReport,
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
}

/** Parse logs, run drift detection, and build the drift report. */
export async function runIngestionPipeline(
  raw: unknown,
  engine: DriftEngine,
): Promise<IngestionResult> {
  const { reference, actual } = parseTrajectoryLogs(raw);
  const analysis = await engine.analyze(reference, actual);
  const report = generateDriftReport(analysis);

  return { reference, actual, analysis, report };
}

export async function fetchAndIngest(
  url: string,
  engine: DriftEngine,
): Promise<IngestionResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load demo log (${response.status})`);
  }
  const raw = JSON.parse(await response.text()) as unknown;
  return runIngestionPipeline(raw, engine);
}
