import type { TrajectoryGraph } from "./graph";
import type { AgentStep } from "./trajectory";

export type DriftIssueKind = "missing_step" | "hallucination" | "deviation";

export type DriftSeverity = "low" | "medium" | "high";

export interface DriftIssue {
  kind: DriftIssueKind;
  severity: DriftSeverity;
  message: string;
  /** Contribution to overall drift in [0, 1]. */
  score: number;
  referenceStepId?: string;
  actualStepId?: string;
}

/** Pairing between reference and actual steps after alignment. */
export interface StepAlignment {
  reference: AgentStep | null;
  actual: AgentStep | null;
  similarity: number;
}

export interface DriftScoreBreakdown {
  /** Overall drift in [0, 1]; 0 = no drift, 1 = maximum drift. */
  driftScore: number;
  /** Embedding-based component in [0, 1]. */
  embeddingScore: number;
  /** Rule-based component in [0, 1]. */
  ruleScore: number;
  /** Weight applied to embedding component. */
  embeddingWeight: number;
  /** Weight applied to rule component. */
  ruleWeight: number;
}

export interface DriftAnalysisResult {
  referenceTrajectoryId: string;
  actualTrajectoryId: string;
  scores: DriftScoreBreakdown;
  issues: DriftIssue[];
  alignment: StepAlignment[];
  graphs: {
    reference: TrajectoryGraph;
    actual: TrajectoryGraph;
  };
}
