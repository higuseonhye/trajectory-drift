// Types
export type {
  StepKind,
  AgentStep,
  Trajectory,
  GraphEdgeKind,
  TrajectoryGraphNode,
  TrajectoryGraphEdge,
  TrajectoryGraph,
  DriftIssueKind,
  DriftSeverity,
  DriftIssue,
  StepAlignment,
  DriftScoreBreakdown,
  DriftAnalysisResult,
} from "./types";

// Trajectory
export {
  createStep,
  createTrajectory,
  resetStepIdCounter,
} from "./trajectory/factory";
export { assertValidStep, assertValidTrajectory } from "./trajectory/validate";

// Graph
export { buildTrajectoryGraph } from "./graph/builder";

// Embeddings
export type { EmbeddingProvider, StepEmbeddingSource } from "./embeddings/types";
export { cosineSimilarity, similarityToDrift } from "./embeddings/similarity";
export { HashEmbeddingProvider } from "./embeddings/hash-embedder";
export { hydrateStepEmbeddings } from "./embeddings/hydrate";

// Rules
export type { DriftRule, RuleContext } from "./rules";
export {
  createDefaultRules,
  MissingStepsRule,
  HallucinationRule,
  DeviationRule,
} from "./rules";

// Drift engine
export type { DriftEngineConfig } from "./drift/config";
export { DEFAULT_DRIFT_CONFIG } from "./drift/config";
export { alignTrajectories } from "./drift/alignment";
export { computeDriftScores } from "./drift/scoring";
export { DriftEngine, type DriftEngineOptions } from "./drift/engine";

// Reports
export type { DriftReportEntry, DriftReportSummary, DriftReport } from "./report";
export { generateDriftReport } from "./report";
