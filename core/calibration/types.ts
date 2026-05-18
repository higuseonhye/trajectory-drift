import type { DriftIssueKind } from "../types";

/** Trajectory behavioral stability classification. */
export type StabilityLevel = "stable" | "unstable" | "elevated_risk";

export type WeakSignalKind =
  | "retry_pattern"
  | "hesitation_loop"
  | "retrieval_inconsistency"
  | "chain_instability"
  | "context_carryover"
  | "retrieval_avoidance";

export interface WeakSignal {
  kind: WeakSignalKind;
  /** Calm, interpretive description — not an error message. */
  interpretation: string;
  stepIds: string[];
  weight: number;
}

export interface TrajectoryForecast {
  /** Estimated probability of further instability in [0, 1]. */
  instabilityRisk: number;
  horizon: "next_steps" | "end_of_run";
  summary: string;
}

export interface CalibrationAction {
  label: string;
  rationale: string;
}

export interface CalibrationInsight {
  id: string;
  relatedIssueKind?: DriftIssueKind;
  stepIds: string[];
  /** Analytical interpretation of why adaptation drifted. */
  interpretation: string;
  instabilityFactors: string[];
  suggestedCalibration: CalibrationAction[];
}

export interface CalibrationMemoryEntry {
  id: string;
  recordedAt: string;
  actualTrajectoryId: string;
  stabilityLevel: StabilityLevel;
  driftKinds: DriftIssueKind[];
  corrections: string[];
  stabilized: boolean;
}

export interface CalibrationMemory {
  entries: CalibrationMemoryEntry[];
  patterns: {
    recurringDriftKinds: DriftIssueKind[];
    successfulCorrections: string[];
  };
}

export interface CalibrationResult {
  stabilityLevel: StabilityLevel;
  continuityScore: number;
  weakSignals: WeakSignal[];
  forecast: TrajectoryForecast;
  insights: CalibrationInsight[];
  globalSummary: string;
  memory: CalibrationMemory;
}
