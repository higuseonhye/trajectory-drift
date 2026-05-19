import type { MomentumMetrics } from "./momentum-engine";
import type { TrajectoryEvent } from "./types";

export type InterventionKind =
  | "interaction_starvation"
  | "momentum_degradation"
  | "loop_fragmentation"
  | "reactive_switching"
  | "abstraction_over_action"
  | "recovery_needed";

export interface InterventionSignal {
  kind: InterventionKind;
  severity: "low" | "medium" | "high";
  interpretation: string;
  suggestedAction: string;
}

export function detectInterventions(
  events: TrajectoryEvent[],
  metrics: MomentumMetrics,
): InterventionSignal[] {
  const signals: InterventionSignal[] = [];

  if (metrics.interactionStarvation) {
    signals.push({
      kind: "interaction_starvation",
      severity: "high",
      interpretation: "No high-quality interactions recorded in the window.",
      suggestedAction:
        "Schedule one real conversation before more solo abstraction work.",
    });
  }

  if (metrics.momentumDegrading) {
    signals.push({
      kind: "momentum_degradation",
      severity: metrics.momentumScore < -50 ? "high" : "medium",
      interpretation: "Momentum density falling — entropy may be compounding.",
      suggestedAction:
        "Identify one smallest action that closes an open loop in the next 24h.",
    });
  }

  if (metrics.openLoops >= 2) {
    signals.push({
      kind: "loop_fragmentation",
      severity: "medium",
      interpretation: `${metrics.openLoops} unfinished loops in the window.`,
      suggestedAction: "Close or explicitly defer loops — do not add new ones.",
    });
  }

  if (events.some((e) => e.tags?.includes("reactive-switch"))) {
    signals.push({
      kind: "reactive_switching",
      severity: "medium",
      interpretation: "Reactive trajectory switching detected.",
      suggestedAction:
        "Hold current hypothesis for a fixed window; log one failed assumption.",
    });
  }

  const avoided = events.filter((e) => e.kind === "action_avoided");
  const gains = events.filter((e) => e.kind === "momentum_gain");
  if (avoided.length > gains.length && avoided.length >= 2) {
    signals.push({
      kind: "abstraction_over_action",
      severity: "medium",
      interpretation: "High abstraction / low action density pattern.",
      suggestedAction:
        "Ship one outward-facing artifact before internal refinement.",
    });
  }

  if (metrics.recoverySignals === 0 && metrics.entropyAccumulation >= 2) {
    signals.push({
      kind: "recovery_needed",
      severity: "low",
      interpretation: "Entropy without recent recovery signals.",
      suggestedAction:
        "Environment reset: walk, offline block, or one non-work activation.",
    });
  }

  return signals;
}
