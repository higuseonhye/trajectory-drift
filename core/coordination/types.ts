import type { AgentStep } from "../types/trajectory";

/** Per-field propagation status across a handoff boundary. */
export type FieldPropagationStatus =
  | "aligned"
  | "mutated"
  | "missing"
  | "unexpected";

export interface FieldPropagationDiff {
  handoffId: string;
  field: string;
  expected: string | null;
  actual: string | null;
  status: FieldPropagationStatus;
}

/** Swimlane data for multi-agent graph visualization. */
export interface AgentLane {
  agentId: string;
  label: string;
  role: string;
  steps: AgentStep[];
}

/** Coordination-level signal — maps to observable handoff / propagation behavior. */
export type CoordinationSignalKind =
  | "handoff_loss"
  | "context_mutation"
  | "delegation_divergence"
  | "memory_fragmentation"
  | "grounding_desync";

export type CoordinationSeverity = "low" | "medium" | "high";

export interface CoordinationAgent {
  id: string;
  role: string;
  label?: string;
}

export interface HandoffRecord {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  /** Optional link to a step in the flattened orchestrator trajectory. */
  stepId?: string;
  intent: string;
  expectedContext: string;
  actualContext: string;
  propagatedFields?: string[];
  /** Structured fields — preferred for field-level diffs. */
  expectedFields?: Record<string, string>;
  actualFields?: Record<string, string>;
}

export interface CoordinationBundle {
  scenario?: string;
  agents: CoordinationAgent[];
  handoffs: HandoffRecord[];
  /** Per-agent step traces for multi-lane visualization. */
  lanes?: AgentLane[];
}

export interface CoordinationSignal {
  kind: CoordinationSignalKind;
  handoffId?: string;
  severity: CoordinationSeverity;
  interpretation: string;
  suggestedCalibration?: string;
}

export type DelegationCoherenceLevel =
  | "aligned"
  | "weakening"
  | "incoherent";

export interface CoordinationResult {
  scenario?: string;
  agentCount: number;
  handoffCount: number;
  /** 0–100 — average context fidelity across handoffs. */
  coordinationIntegrity: number;
  delegationCoherence: DelegationCoherenceLevel;
  signals: CoordinationSignal[];
  propagationDiffs: FieldPropagationDiff[];
  lanes: AgentLane[];
  handoffs: HandoffRecord[];
  observation: string;
  summary: string;
}
