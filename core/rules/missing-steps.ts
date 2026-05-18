import type { DriftIssue, StepAlignment } from "../types";
import type { DriftRule, RuleContext } from "./types";

function severityFromGapCount(gapCount: number): DriftIssue["severity"] {
  if (gapCount >= 3) return "high";
  if (gapCount >= 2) return "medium";
  return "low";
}

export class MissingStepsRule implements DriftRule {
  readonly id = "missing_steps";

  evaluate({ alignment, config }: RuleContext): DriftIssue[] {
    const missing = alignment.filter((pair) => pair.reference && !pair.actual);
    if (missing.length === 0) return [];

    const severity = severityFromGapCount(missing.length);
    const issues: DriftIssue[] = missing.map((pair: StepAlignment) => ({
      kind: "missing_step",
      severity,
      message: `Expected step "${pair.reference!.label}" (${pair.reference!.kind}) is absent in actual trajectory`,
      score: 1,
      referenceStepId: pair.reference!.id,
    }));

    // Down-weight individual scores when many are missing; aggregate handled in scoring
    const perIssueScore = Math.min(1, config.gapPenalty * 2);
    return issues.map((issue) => ({ ...issue, score: perIssueScore }));
  }
}
