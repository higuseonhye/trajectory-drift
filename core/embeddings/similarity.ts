/** Cosine similarity in [-1, 1]. Returns 0 when vectors are empty or mismatched length. */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Maps cosine similarity from [-1, 1] to drift contribution in [0, 1]. */
export function similarityToDrift(similarity: number): number {
  return Math.max(0, Math.min(1, 1 - (similarity + 1) / 2));
}
