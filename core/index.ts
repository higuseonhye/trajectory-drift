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

// Calibration
export type {
  StabilityLevel,
  WeakSignalKind,
  WeakSignal,
  TrajectoryForecast,
  CalibrationAction,
  CalibrationInsight,
  CalibrationMemoryEntry,
  CalibrationMemory,
  CalibrationResult,
} from "./calibration";
export {
  runCalibration,
  createEmptyMemory,
  detectWeakSignals,
  forecastTrajectoryInstability,
  getCoherenceIndicator,
  COHERENCE_INDICATORS,
  assessContextQuality,
  getDryObservation,
} from "./calibration";
export type {
  CoherenceIndicator,
  ContextQualityKind,
  ContextQualitySignal,
  JournalEntry,
  RecoveryNote,
} from "./calibration";

// Coordination
export type {
  AgentLane,
  CoordinationAgent,
  CoordinationBundle,
  CoordinationResult,
  CoordinationSignal,
  CoordinationSignalKind,
  DelegationCoherenceLevel,
  FieldPropagationDiff,
  HandoffRecord,
} from "./coordination";
export {
  runCoordinationAnalysis,
  getCoordinationObservation,
  diffAllHandoffs,
  parseContextFields,
} from "./coordination";

// Human–AI coherence
export type {
  HumanAiBundle,
  HumanAiCoherenceResult,
  HumanAiCoherenceSignal,
  HumanAiCoherenceLevel,
  HumanAiInteraction,
} from "./human-ai";
export { runHumanAiCoherenceAnalysis } from "./human-ai";

// Organizational memory
export type {
  OrgCoherenceLevel,
  OrgIncident,
  OrgMemoryBundle,
  OrgMemoryEntry,
  OrgMemoryResult,
  OrgMemoryStore,
  OrgPolicy,
} from "./org-memory";
export {
  runOrgMemoryAnalysis,
  createEmptyOrgMemory,
  recordOrgPattern,
} from "./org-memory";

// Human trajectory (native bridge)
export type {
  TrajectoryEvent,
  TrajectoryEventKind,
  HumanTrajectoryResult,
  MomentumMetrics,
  InterventionSignal,
  InteractionGraph,
  InteractionNode,
} from "./human-trajectory";
export {
  runHumanTrajectoryAnalysis,
  computeMomentumMetrics,
  buildInteractionGraph,
  detectInterventions,
} from "./human-trajectory";
