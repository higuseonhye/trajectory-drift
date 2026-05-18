import { getHumanAiObservation } from "./observations";
import type {
  HumanAiBundle,
  HumanAiCoherenceLevel,
  HumanAiCoherenceResult,
  HumanAiCoherenceSignal,
  HumanAiInteraction,
} from "./types";

function resolveLevel(score: number): HumanAiCoherenceLevel {
  if (score >= 70) return "stable";
  if (score >= 45) return "strained";
  return "fatigued";
}

function analyzeInteractions(
  interactions: HumanAiInteraction[],
): HumanAiCoherenceSignal[] {
  const signals: HumanAiCoherenceSignal[] = [];

  const overrides = interactions.filter((i) => i.kind === "human_override");
  if (overrides.length >= 2) {
    signals.push({
      kind: "override_pattern",
      severity: "medium",
      interpretation: `${overrides.length} human overrides — agent plan may be diverging from operator intent.`,
      suggestedCalibration: "Reconcile delegation contract with operator expectations",
    });
  }

  const longGaps = interactions.filter(
    (i) => i.latencyMinutes !== undefined && i.latencyMinutes >= 60,
  );
  if (longGaps.length > 0) {
    signals.push({
      kind: "async_fatigue",
      severity: longGaps.length >= 2 ? "high" : "medium",
      interpretation: `Async gap(s) up to ${Math.max(...longGaps.map((i) => i.latencyMinutes ?? 0))} min — context may have gone stale.`,
      suggestedCalibration: "Re-ground session before synthesis",
    });
  }

  const agentThenHumanMismatch = interactions.some(
    (i, idx) =>
      i.actor === "agent" &&
      interactions[idx + 1]?.kind === "human_override",
  );
  if (agentThenHumanMismatch) {
    signals.push({
      kind: "interaction_incoherence",
      severity: "medium",
      interpretation:
        "Agent output followed by human correction — interaction loop not closed.",
      suggestedCalibration: "Capture override reason in adaptation journal",
    });
  }

  const contaminationHints = interactions.filter((i) =>
    /forum|unverified|stale/i.test(i.content),
  );
  if (contaminationHints.length > 0) {
    signals.push({
      kind: "memory_contamination",
      severity: "high",
      interpretation:
        "Human–AI thread may be carrying unverified or stale context.",
      suggestedCalibration: "Isolate contaminated context before next handoff",
    });
  }

  return signals;
}

function analyzeSignals(
  bundle: HumanAiBundle,
  interactionSignals: HumanAiCoherenceSignal[],
): { score: number; signals: HumanAiCoherenceSignal[] } {
  const signals = [...interactionSignals];
  let score = 85;

  const meta = bundle.signals;
  if (meta?.asyncWorkflow) score -= 8;
  if ((meta?.humanOverrides ?? 0) >= 2) {
    score -= 15;
    signals.push({
      kind: "override_pattern",
      severity: "high",
      interpretation: "Repeated human overrides in this workflow.",
    });
  }
  if ((meta?.sessionLengthMinutes ?? 0) >= 90) {
    score -= 10;
    signals.push({
      kind: "cognitive_overload",
      severity: "medium",
      interpretation: `Long session (${meta?.sessionLengthMinutes} min) — cognitive load may affect coherence.`,
      suggestedCalibration: "Consider session boundary or context refresh",
    });
  }
  if ((meta?.concurrentThreads ?? 0) >= 3) {
    score -= 12;
    signals.push({
      kind: "cognitive_overload",
      severity: "medium",
      interpretation: `${meta?.concurrentThreads} concurrent threads — attention fragmentation risk.`,
    });
  }

  return { score: Math.max(0, Math.min(100, score)), signals };
}

/** Assess humane coherence in human–AI collaborative workflows. */
export function runHumanAiCoherenceAnalysis(
  bundle: HumanAiBundle,
): HumanAiCoherenceResult {
  const interactionSignals = analyzeInteractions(bundle.interactions);
  const { score, signals } = analyzeSignals(bundle, interactionSignals);
  const level = resolveLevel(score);

  return {
    level,
    interactionCount: bundle.interactions.length,
    coherenceScore: score,
    signals,
    observation: getHumanAiObservation(level),
    summary:
      level === "stable"
        ? `${bundle.interactions.length} interactions · human–AI coherence stable`
        : level === "strained"
          ? `${bundle.interactions.length} interactions · coordination strained`
          : `${bundle.interactions.length} interactions · coordination fatigue`,
  };
}
