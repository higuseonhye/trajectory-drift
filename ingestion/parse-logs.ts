import type { AgentStep, StepKind, Trajectory } from "@/core";

const STEP_KINDS = new Set<StepKind>([
  "thought",
  "tool_call",
  "observation",
  "response",
  "decision",
]);

export interface TrajectoryLogPayload {
  reference: Trajectory;
  actual: Trajectory;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeStep(raw: unknown, index: number): AgentStep {
  if (!isRecord(raw)) {
    throw new Error(`Step at index ${index} must be an object`);
  }

  const kind = raw.kind;
  if (typeof kind !== "string" || !STEP_KINDS.has(kind as StepKind)) {
    throw new Error(`Step ${index}: invalid or missing kind`);
  }

  const label = typeof raw.label === "string" ? raw.label : `Step ${index + 1}`;
  const content =
    typeof raw.content === "string" ? raw.content : JSON.stringify(raw);

  const step: AgentStep = {
    id: typeof raw.id === "string" ? raw.id : `step-${index + 1}`,
    kind: kind as StepKind,
    label,
    content,
  };

  if (Array.isArray(raw.dependsOn)) {
    step.dependsOn = raw.dependsOn.filter((d): d is string => typeof d === "string");
  }

  if (Array.isArray(raw.embedding) && raw.embedding.every((n) => typeof n === "number")) {
    step.embedding = raw.embedding as number[];
  }

  if (isRecord(raw.metadata)) {
    step.metadata = raw.metadata;
  }

  return step;
}

function normalizeTrajectory(raw: unknown, fallbackId: string): Trajectory {
  if (!isRecord(raw)) {
    throw new Error(`Trajectory "${fallbackId}" must be an object`);
  }

  if (!Array.isArray(raw.steps)) {
    throw new Error(`Trajectory "${fallbackId}" must include a steps array`);
  }

  const id = typeof raw.id === "string" ? raw.id : fallbackId;
  const steps = raw.steps.map((step, index) => normalizeStep(step, index));

  const trajectory: Trajectory = { id, steps };
  if (isRecord(raw.metadata)) {
    trajectory.metadata = raw.metadata;
  }

  return trajectory;
}

/**
 * Accepts JSON log payloads:
 * - `{ reference, actual }` (preferred)
 * - `{ trajectory }` with optional `reference`
 */
export function parseTrajectoryLogs(json: unknown): TrajectoryLogPayload {
  if (!isRecord(json)) {
    throw new Error("Log file must be a JSON object");
  }

  if (json.reference !== undefined && json.actual !== undefined) {
    return {
      reference: normalizeTrajectory(json.reference, "reference"),
      actual: normalizeTrajectory(json.actual, "actual"),
    };
  }

  if (json.trajectory !== undefined) {
    const actual = normalizeTrajectory(json.trajectory, "actual");
    const reference =
      json.reference !== undefined
        ? normalizeTrajectory(json.reference, "reference")
        : { id: "reference", steps: [] };
    return { reference, actual };
  }

  if (Array.isArray(json.steps)) {
    return {
      reference: { id: "reference", steps: [] },
      actual: normalizeTrajectory(json, "actual"),
    };
  }

  throw new Error(
    "Expected { reference, actual }, { trajectory, reference? }, or a trajectory object with steps",
  );
}
