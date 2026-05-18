import { cosineSimilarity } from "../embeddings/similarity";
import type { AgentStep, StepAlignment } from "../types";
import type { DriftEngineConfig } from "./config";

function stepSimilarity(a: AgentStep, b: AgentStep): number {
  const kindBonus = a.kind === b.kind ? 0.1 : 0;
  const aVec = a.embedding ?? [];
  const bVec = b.embedding ?? [];
  const embedSim = cosineSimilarity(aVec, bVec);
  return Math.min(1, embedSim + kindBonus);
}

/**
 * Needleman–Wunsch–style global alignment between reference and actual steps.
 * Maximizes cumulative similarity while penalizing gaps.
 */
export function alignTrajectories(
  referenceSteps: AgentStep[],
  actualSteps: AgentStep[],
  config: DriftEngineConfig,
): StepAlignment[] {
  const m = referenceSteps.length;
  const n = actualSteps.length;

  if (m === 0 && n === 0) return [];

  const { gapPenalty } = config;

  // score[i][j] = best score aligning ref[0..i) with actual[0..j)
  const score: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  const trace: ("diag" | "up" | "left")[][] = Array.from({ length: m + 1 }, () =>
    new Array<"diag" | "up" | "left">(n + 1).fill("diag"),
  );

  for (let i = 1; i <= m; i++) {
    score[i][0] = score[i - 1][0] - gapPenalty;
    trace[i][0] = "up";
  }
  for (let j = 1; j <= n; j++) {
    score[0][j] = score[0][j - 1] - gapPenalty;
    trace[0][j] = "left";
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = score[i - 1][j - 1] + stepSimilarity(referenceSteps[i - 1], actualSteps[j - 1]);
      const delRef = score[i - 1][j] - gapPenalty;
      const delActual = score[i][j - 1] - gapPenalty;

      if (match >= delRef && match >= delActual) {
        score[i][j] = match;
        trace[i][j] = "diag";
      } else if (delRef >= delActual) {
        score[i][j] = delRef;
        trace[i][j] = "up";
      } else {
        score[i][j] = delActual;
        trace[i][j] = "left";
      }
    }
  }

  const alignment: StepAlignment[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && trace[i][j] === "diag") {
      const ref = referenceSteps[i - 1];
      const act = actualSteps[j - 1];
      alignment.unshift({
        reference: ref,
        actual: act,
        similarity: stepSimilarity(ref, act),
      });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || trace[i][j] === "up")) {
      alignment.unshift({
        reference: referenceSteps[i - 1],
        actual: null,
        similarity: 0,
      });
      i--;
    } else {
      alignment.unshift({
        reference: null,
        actual: actualSteps[j - 1],
        similarity: 0,
      });
      j--;
    }
  }

  return alignment;
}
