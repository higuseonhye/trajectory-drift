import { similarityToDrift } from "../embeddings/similarity";
import type {
  DriftIssue,
  DriftScoreBreakdown,
  StepAlignment,
} from "../types";
import type { DriftEngineConfig } from "./config";

const SEVERITY_WEIGHT: Record<DriftIssue["severity"], number> = {
  low: 0.33,
  medium: 0.66,
  high: 1,
};

function computeEmbeddingScore(alignment: StepAlignment[]): number {
  const matched = alignment.filter((p) => p.reference && p.actual);
  if (matched.length === 0) {
    return alignment.length === 0 ? 0 : 1;
  }

  const totalDrift = matched.reduce(
    (sum, pair) => sum + similarityToDrift(pair.similarity),
    0,
  );
  return totalDrift / matched.length;
}

function computeRuleScore(issues: DriftIssue[]): number {
  if (issues.length === 0) return 0;

  const total = issues.reduce(
    (sum, issue) => sum + issue.score * SEVERITY_WEIGHT[issue.severity],
    0,
  );
  return Math.min(1, total / issues.length);
}

export function computeDriftScores(
  alignment: StepAlignment[],
  issues: DriftIssue[],
  config: DriftEngineConfig,
): DriftScoreBreakdown {
  const embeddingScore = computeEmbeddingScore(alignment);
  const ruleScore = computeRuleScore(issues);

  const totalWeight = config.embeddingWeight + config.ruleWeight;
  const embeddingWeight = config.embeddingWeight / totalWeight;
  const ruleWeight = config.ruleWeight / totalWeight;

  const driftScore = Math.min(
    1,
    embeddingScore * embeddingWeight + ruleScore * ruleWeight,
  );

  return {
    driftScore,
    embeddingScore,
    ruleScore,
    embeddingWeight,
    ruleWeight,
  };
}
