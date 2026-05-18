import type { AgentStep } from "../types";

export interface EmbeddingProvider {
  readonly dimension: number;
  embed(text: string): Promise<number[]> | number[];
}

export type StepEmbeddingSource = Pick<AgentStep, "id" | "content" | "embedding">;
