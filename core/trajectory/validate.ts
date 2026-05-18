import type { AgentStep, Trajectory } from "../types";

const STEP_KINDS = new Set([
  "thought",
  "tool_call",
  "observation",
  "response",
  "decision",
]);

export function assertValidStep(step: AgentStep): void {
  if (!step.id.trim()) {
    throw new Error("AgentStep.id must be non-empty");
  }
  if (!STEP_KINDS.has(step.kind)) {
    throw new Error(`Invalid step kind: ${step.kind}`);
  }
  if (!step.label.trim()) {
    throw new Error(`AgentStep ${step.id}: label must be non-empty`);
  }
}

export function assertValidTrajectory(trajectory: Trajectory): void {
  if (!trajectory.id.trim()) {
    throw new Error("Trajectory.id must be non-empty");
  }

  const seen = new Set<string>();
  for (const step of trajectory.steps) {
    assertValidStep(step);
    if (seen.has(step.id)) {
      throw new Error(`Duplicate step id: ${step.id}`);
    }
    seen.add(step.id);
  }

  for (const step of trajectory.steps) {
    for (const depId of step.dependsOn ?? []) {
      if (!seen.has(depId)) {
        throw new Error(
          `Step ${step.id} depends on unknown step id: ${depId}`,
        );
      }
    }
  }
}
