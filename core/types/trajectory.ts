/** Kinds of steps in an agent execution trace. */
export type StepKind =
  | "thought"
  | "tool_call"
  | "observation"
  | "response"
  | "decision";

/** A single step in an agent trajectory. */
export interface AgentStep {
  id: string;
  kind: StepKind;
  /** Short human-readable label for the step. */
  label: string;
  /** Primary textual content used for embedding and rule checks. */
  content: string;
  /** Optional precomputed embedding; filled by the engine when absent. */
  embedding?: number[];
  /** Explicit dependency edges to other step ids (beyond sequential order). */
  dependsOn?: string[];
  metadata?: Record<string, unknown>;
}

/** An ordered sequence of agent steps. */
export interface Trajectory {
  id: string;
  steps: AgentStep[];
  metadata?: Record<string, unknown>;
}
