export interface DriftEngineConfig {
  /** Minimum cosine similarity for a pair to count as a match. */
  matchThreshold: number;
  /** Penalty when skipping a step during alignment (gap cost). */
  gapPenalty: number;
  /** Weight for embedding-based drift in the composite score. */
  embeddingWeight: number;
  /** Weight for rule-based drift in the composite score. */
  ruleWeight: number;
  /** Similarity below this on an aligned pair triggers a deviation issue. */
  deviationThreshold: number;
  /** Similarity below this for unmatched actual steps escalates hallucination severity. */
  hallucinationThreshold: number;
}

export const DEFAULT_DRIFT_CONFIG: DriftEngineConfig = {
  matchThreshold: 0.55,
  gapPenalty: 0.35,
  embeddingWeight: 0.5,
  ruleWeight: 0.5,
  deviationThreshold: 0.65,
  hallucinationThreshold: 0.4,
};
