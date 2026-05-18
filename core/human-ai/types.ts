export type HumanAiActor = "human" | "agent" | "system";

export type HumanAiInteractionKind =
  | "operator_review"
  | "human_override"
  | "async_handoff"
  | "agent_response"
  | "escalation"
  | "context_note";

export interface HumanAiInteraction {
  id: string;
  kind: HumanAiInteractionKind;
  actor: HumanAiActor;
  content: string;
  /** Minutes since prior interaction — async fatigue signal. */
  latencyMinutes?: number;
}

export interface HumanAiSignals {
  asyncWorkflow?: boolean;
  humanOverrides?: number;
  sessionLengthMinutes?: number;
  concurrentThreads?: number;
}

export interface HumanAiBundle {
  interactions: HumanAiInteraction[];
  signals?: HumanAiSignals;
}

export type HumanAiCoherenceLevel = "stable" | "strained" | "fatigued";

export type HumanAiSignalKind =
  | "cognitive_overload"
  | "interaction_incoherence"
  | "async_fatigue"
  | "override_pattern"
  | "memory_contamination";

export interface HumanAiCoherenceSignal {
  kind: HumanAiSignalKind;
  severity: "low" | "medium" | "high";
  interpretation: string;
  suggestedCalibration?: string;
}

export interface HumanAiCoherenceResult {
  level: HumanAiCoherenceLevel;
  interactionCount: number;
  /** 0–100 — humane coherence score. */
  coherenceScore: number;
  signals: HumanAiCoherenceSignal[];
  observation: string;
  summary: string;
}
