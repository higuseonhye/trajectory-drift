import type { AgentStep, StepKind, Trajectory } from "../types";
import { assertValidTrajectory } from "./validate";

let stepCounter = 0;

export function createStep(
  input: Omit<AgentStep, "id"> & { id?: string },
): AgentStep {
  return {
    id: input.id ?? `step-${++stepCounter}`,
    kind: input.kind,
    label: input.label,
    content: input.content,
    embedding: input.embedding,
    dependsOn: input.dependsOn,
    metadata: input.metadata,
  };
}

export function createTrajectory(
  id: string,
  steps: AgentStep[],
  metadata?: Record<string, unknown>,
): Trajectory {
  const trajectory: Trajectory = { id, steps, metadata };
  assertValidTrajectory(trajectory);
  return trajectory;
}

export function resetStepIdCounter(): void {
  stepCounter = 0;
}

export type { StepKind };
