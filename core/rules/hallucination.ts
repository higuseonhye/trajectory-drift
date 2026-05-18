import { cosineSimilarity } from "../embeddings/similarity";
import type { AgentStep, DriftIssue } from "../types";
import type { DriftRule, RuleContext } from "./types";

function maxSimilarityToReference(
  actual: AgentStep,
  referenceSteps: AgentStep[],
): number {
  if (!actual.embedding?.length) return 0;

  let best = 0;
  for (const ref of referenceSteps) {
    if (!ref.embedding?.length) continue;
    best = Math.max(best, cosineSimilarity(actual.embedding, ref.embedding));
  }
  return best;
}

function isToolOrObservationHallucination(step: AgentStep): boolean {
  return step.kind === "tool_call" || step.kind === "observation";
}

export class HallucinationRule implements DriftRule {
  readonly id = "hallucination";

  evaluate({
    alignment,
    referenceSteps,
    config,
  }: RuleContext): DriftIssue[] {
    const issues: DriftIssue[] = [];

    for (const pair of alignment) {
      if (pair.reference || !pair.actual) continue;

      const actual = pair.actual;
      const nearestSim = maxSimilarityToReference(actual, referenceSteps);
      const isUnanchored = nearestSim < config.hallucinationThreshold;
      const isStructural =
        isToolOrObservationHallucination(actual) && nearestSim < config.matchThreshold;

      if (!isUnanchored && !isStructural) continue;

      const severity: DriftIssue["severity"] =
        isStructural || nearestSim < 0.2
          ? "high"
          : nearestSim < config.hallucinationThreshold
            ? "medium"
            : "low";

      issues.push({
        kind: "hallucination",
        severity,
        message: `Unexpected step "${actual.label}" (${actual.kind}) with low grounding (similarity ${nearestSim.toFixed(2)})`,
        score: Math.min(1, 1 - nearestSim),
        actualStepId: actual.id,
      });
    }

    return issues;
  }
}
