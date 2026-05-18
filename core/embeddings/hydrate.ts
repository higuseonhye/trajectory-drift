import type { AgentStep } from "../types";
import type { EmbeddingProvider } from "./types";

/** Ensures every step has an embedding, reusing existing vectors when present. */
export async function hydrateStepEmbeddings(
  steps: AgentStep[],
  provider: EmbeddingProvider,
): Promise<AgentStep[]> {
  return Promise.all(
    steps.map(async (step) => {
      if (step.embedding && step.embedding.length === provider.dimension) {
        return step;
      }
      const embedding = await provider.embed(step.content);
      return { ...step, embedding };
    }),
  );
}
