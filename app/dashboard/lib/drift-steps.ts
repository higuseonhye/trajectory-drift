import type { DriftAnalysisResult, DriftIssue } from "@/core";

/** Step ids on the actual trajectory that should be highlighted as drift. */
export function collectDriftStepIds(result: DriftAnalysisResult): Set<string> {
  const ids = new Set<string>();

  for (const issue of result.issues) {
    if (issue.actualStepId) ids.add(issue.actualStepId);
  }

  for (const pair of result.alignment) {
    if (!pair.reference && pair.actual) {
      ids.add(pair.actual.id);
    }
    if (pair.reference && pair.actual) {
      if (pair.reference.kind !== pair.actual.kind) {
        ids.add(pair.actual.id);
      }
      if (pair.similarity < 0.65) {
        ids.add(pair.actual.id);
      }
    }
  }

  return ids;
}

export function issuesForStep(
  issues: DriftIssue[],
  stepId: string,
): DriftIssue[] {
  return issues.filter(
    (i) => i.actualStepId === stepId || i.referenceStepId === stepId,
  );
}

export function formatPercent(score: number): string {
  return `${Math.round(score * 100)}%`;
}
