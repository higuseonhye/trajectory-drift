import type { DriftIssue } from "../types";
import type { DriftRule, RuleContext } from "./types";

export class DeviationRule implements DriftRule {
  readonly id = "deviation";

  evaluate({ alignment, config }: RuleContext): DriftIssue[] {
    const issues: DriftIssue[] = [];

    for (const pair of alignment) {
      if (!pair.reference || !pair.actual) continue;

      const { reference: ref, actual: act, similarity } = pair;
      const kindMismatch = ref.kind !== act.kind;
      const semanticDrift = similarity < config.deviationThreshold;

      if (!kindMismatch && !semanticDrift) continue;

      const severity: DriftIssue["severity"] =
        kindMismatch && semanticDrift
          ? "high"
          : kindMismatch || similarity < config.matchThreshold
            ? "medium"
            : "low";

      const parts: string[] = [];
      if (kindMismatch) {
        parts.push(`kind mismatch (expected ${ref.kind}, got ${act.kind})`);
      }
      if (semanticDrift) {
        parts.push(`low similarity (${similarity.toFixed(2)})`);
      }

      issues.push({
        kind: "deviation",
        severity,
        message: `Step "${act.label}" deviates from reference "${ref.label}": ${parts.join(", ")}`,
        score: Math.min(1, kindMismatch ? 0.6 + (1 - similarity) * 0.4 : 1 - similarity),
        referenceStepId: ref.id,
        actualStepId: act.id,
      });
    }

    return issues;
  }
}
