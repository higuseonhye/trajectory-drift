import type { AgentStep, Trajectory } from "../types";

export type ContextQualityKind =
  | "stale_context"
  | "recursive_reference"
  | "conflicting_memory"
  | "weak_grounding"
  | "excessive_carryover";

export interface ContextQualitySignal {
  kind: ContextQualityKind;
  interpretation: string;
  stepIds: string[];
}

const KIND_LABELS: Record<ContextQualityKind, string> = {
  stale_context: "Stale context attachment",
  recursive_reference: "Recursive self-reference",
  conflicting_memory: "Conflicting memory",
  weak_grounding: "Weak grounding",
  excessive_carryover: "Excessive conversational carry-over",
};

export function assessContextQuality(actual: Trajectory): ContextQualitySignal[] {
  const signals: ContextQualitySignal[] = [];
  const steps = actual.steps;

  const carrySteps = steps.filter((s) =>
    /carry|previous|earlier|from before|without.*ground|still believe/i.test(
      `${s.label} ${s.content}`,
    ),
  );
  if (carrySteps.length > 0) {
    signals.push({
      kind: "excessive_carryover",
      interpretation:
        "The run may be leaning on prior conversational momentum more than fresh grounding.",
      stepIds: carrySteps.map((s) => s.id),
    });
  }

  const recursiveSteps = steps.filter((s) =>
    /as (i|we) (said|noted|mentioned)|again i|reiterat/i.test(s.content),
  );
  if (recursiveSteps.length >= 2) {
    signals.push({
      kind: "recursive_reference",
      interpretation:
        "Repeated self-reference without new observational input can narrow context quality.",
      stepIds: recursiveSteps.map((s) => s.id),
    });
  }

  const staleSteps = steps.filter((s) =>
    /outdated|old context|no longer valid|stale/i.test(s.content),
  );
  if (staleSteps.length > 0) {
    signals.push({
      kind: "stale_context",
      interpretation: "Some steps appear attached to context that may no longer apply.",
      stepIds: staleSteps.map((s) => s.id),
    });
  }

  const weakGround = steps.filter(
    (s) =>
      s.kind === "observation" &&
      /forum|unverified|unclear|not from|without source/i.test(s.content),
  );
  if (weakGround.length > 0) {
    signals.push({
      kind: "weak_grounding",
      interpretation: "Observations may lack stable grounding in approved sources.",
      stepIds: weakGround.map((s) => s.id),
    });
  }

  const toolLabels = steps.filter((s) => s.kind === "tool_call").map((s) => s.label);
  const uniqueTools = new Set(toolLabels);
  if (toolLabels.length >= 3 && uniqueTools.size >= 2) {
    const conflictSteps = steps.filter((s) => s.kind === "tool_call");
    signals.push({
      kind: "conflicting_memory",
      interpretation:
        "Multiple lookup paths in one run can introduce conflicting context threads.",
      stepIds: conflictSteps.map((s) => s.id),
    });
  }

  return signals.map((s) => ({
    ...s,
    interpretation: `${KIND_LABELS[s.kind]}. ${s.interpretation}`,
  }));
}
