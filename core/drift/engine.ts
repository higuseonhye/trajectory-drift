import type { EmbeddingProvider } from "../embeddings/types";
import { hydrateStepEmbeddings } from "../embeddings/hydrate";
import { buildTrajectoryGraph } from "../graph/builder";
import { createDefaultRules, type DriftRule } from "../rules";
import { assertValidTrajectory } from "../trajectory/validate";
import type { DriftAnalysisResult, Trajectory } from "../types";
import { alignTrajectories } from "./alignment";
import {
  DEFAULT_DRIFT_CONFIG,
  type DriftEngineConfig,
} from "./config";
import { computeDriftScores } from "./scoring";

export interface DriftEngineOptions {
  embeddingProvider: EmbeddingProvider;
  config?: Partial<DriftEngineConfig>;
  rules?: DriftRule[];
}

export class DriftEngine {
  private readonly provider: EmbeddingProvider;
  private readonly config: DriftEngineConfig;
  private readonly rules: DriftRule[];

  constructor(options: DriftEngineOptions) {
    this.provider = options.embeddingProvider;
    this.config = { ...DEFAULT_DRIFT_CONFIG, ...options.config };
    this.rules = options.rules ?? createDefaultRules();
  }

  async analyze(
    reference: Trajectory,
    actual: Trajectory,
  ): Promise<DriftAnalysisResult> {
    assertValidTrajectory(reference);
    assertValidTrajectory(actual);

    const [refSteps, actualSteps] = await Promise.all([
      hydrateStepEmbeddings(reference.steps, this.provider),
      hydrateStepEmbeddings(actual.steps, this.provider),
    ]);

    const refWithEmbeddings: Trajectory = { ...reference, steps: refSteps };
    const actualWithEmbeddings: Trajectory = { ...actual, steps: actualSteps };

    const alignment = alignTrajectories(refSteps, actualSteps, this.config);

    const ruleContext = {
      alignment,
      referenceSteps: refSteps,
      actualSteps: actualSteps,
      config: this.config,
    };

    const issues = this.rules.flatMap((rule) => rule.evaluate(ruleContext));
    const scores = computeDriftScores(alignment, issues, this.config);

    return {
      referenceTrajectoryId: reference.id,
      actualTrajectoryId: actual.id,
      scores,
      issues,
      alignment,
      graphs: {
        reference: buildTrajectoryGraph(refWithEmbeddings),
        actual: buildTrajectoryGraph(actualWithEmbeddings),
      },
    };
  }
}
