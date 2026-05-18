import {
  DriftEngine,
  generateDriftReport,
  runCalibration,
  runCoordinationAnalysis,
  runHumanAiCoherenceAnalysis,
  createEmptyOrgMemory,
  runOrgMemoryAnalysis,
  recordOrgPattern,
  type CalibrationMemory,
  type CalibrationResult,
  type CoordinationResult,
  type DriftAnalysisResult,
  type DriftReport,
  type HumanAiCoherenceResult,
  type OrgMemoryResult,
  type OrgMemoryStore,
  type Trajectory,
} from "@/core";
import { parseCoordinationBundle } from "./parse-coordination";
import { parseHumanAiBundle } from "./parse-human-ai";
import { parseOrgMemoryBundle } from "./parse-org-memory";
import { parseTrajectoryLogs } from "./parse-logs";

export interface IngestionPipelineOptions {
  priorMemory?: CalibrationMemory;
  orgMemoryStore?: OrgMemoryStore;
}

export interface IngestionResult {
  reference: Trajectory;
  actual: Trajectory;
  analysis: DriftAnalysisResult;
  report: DriftReport;
  calibration: CalibrationResult;
  coordination?: CoordinationResult;
  humanAi?: HumanAiCoherenceResult;
  orgMemory?: OrgMemoryResult;
  orgMemoryStore?: OrgMemoryStore;
}

/** Parse logs → detect drift → interpret → recalibrate. */
export async function runIngestionPipeline(
  raw: unknown,
  engine: DriftEngine,
  options: IngestionPipelineOptions = {},
): Promise<IngestionResult> {
  const { reference, actual } = parseTrajectoryLogs(raw);
  const analysis = await engine.analyze(reference, actual);
  const report = generateDriftReport(analysis);
  const calibration = runCalibration(analysis, reference, actual, {
    priorMemory: options.priorMemory,
  });

  const bundle = parseCoordinationBundle(raw);
  const coordination = bundle
    ? runCoordinationAnalysis(bundle, actual)
    : undefined;

  const humanAiBundle = parseHumanAiBundle(raw);
  const humanAi = humanAiBundle
    ? runHumanAiCoherenceAnalysis(humanAiBundle)
    : undefined;

  const orgBundle = parseOrgMemoryBundle(raw);
  let orgMemoryStore = options.orgMemoryStore;
  let orgMemory: OrgMemoryResult | undefined;
  if (orgBundle) {
    orgMemoryStore =
      orgMemoryStore ?? createEmptyOrgMemory(orgBundle.teamId ?? "default");
    orgMemory = runOrgMemoryAnalysis(orgBundle, orgMemoryStore, {
      coordination,
      calibration,
    });
    if (orgMemory.level !== "aligned" && orgMemory.signals[0]) {
      orgMemoryStore = recordOrgPattern(
        orgMemoryStore,
        orgMemory.signals[0].interpretation.slice(0, 120),
        orgMemory.signals[0].suggestedCalibration,
      );
    }
  }

  return {
    reference,
    actual,
    analysis,
    report,
    calibration,
    coordination,
    humanAi,
    orgMemory,
    orgMemoryStore,
  };
}

export async function fetchAndIngest(
  url: string,
  engine: DriftEngine,
  options: IngestionPipelineOptions = {},
): Promise<IngestionResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load demo log (${response.status})`);
  }
  const raw = JSON.parse(await response.text()) as unknown;
  return runIngestionPipeline(raw, engine, options);
}
