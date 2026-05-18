import type { EmbeddingProvider } from "./types";

const DEFAULT_DIMENSION = 64;

/**
 * Deterministic, dependency-free embedder for local development and tests.
 * Not suitable for production semantic search — swap for a real model provider.
 */
export class HashEmbeddingProvider implements EmbeddingProvider {
  readonly dimension: number;

  constructor(dimension: number = DEFAULT_DIMENSION) {
    this.dimension = dimension;
  }

  embed(text: string): number[] {
    const vector = new Array<number>(this.dimension).fill(0);
    const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);

    for (const token of tokens) {
      const hash = fnv1a(token);
      const index = hash % this.dimension;
      const sign = hash % 2 === 0 ? 1 : -1;
      vector[index] += sign;
    }

    return normalize(vector);
  }
}

function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  if (norm === 0) return vector;
  return vector.map((v) => v / norm);
}
