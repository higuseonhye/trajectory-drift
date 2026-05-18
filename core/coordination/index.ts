export type {
  AgentLane,
  CoordinationAgent,
  CoordinationBundle,
  CoordinationResult,
  CoordinationSeverity,
  CoordinationSignal,
  CoordinationSignalKind,
  DelegationCoherenceLevel,
  FieldPropagationDiff,
  FieldPropagationStatus,
  HandoffRecord,
} from "./types";
export { contextFidelity } from "./fidelity";
export { parseContextFields } from "./context-fields";
export { diffAllHandoffs, diffHandoffPropagation } from "./propagation-diff";
export { buildLanesFromBundle } from "./lanes";
export { runCoordinationAnalysis } from "./analyze";
export { getCoordinationObservation } from "./observations";
