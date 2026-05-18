import type { AgentStep } from "../types/trajectory";
import type { AgentLane, CoordinationBundle } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseLaneStep(raw: unknown, index: number): AgentStep {
  if (!isRecord(raw)) {
    throw new Error(`lane step ${index} must be an object`);
  }
  const kind = raw.kind;
  const kinds = new Set([
    "thought",
    "tool_call",
    "observation",
    "response",
    "decision",
  ]);
  if (typeof kind !== "string" || !kinds.has(kind)) {
    throw new Error(`lane step ${index}: invalid kind`);
  }
  return {
    id: typeof raw.id === "string" ? raw.id : `lane-step-${index}`,
    kind: kind as AgentStep["kind"],
    label: typeof raw.label === "string" ? raw.label : `Step ${index + 1}`,
    content: typeof raw.content === "string" ? raw.content : "",
  };
}

/** Build swimlanes from explicit lanes or synthesize from agents + handoffs. */
export function buildLanesFromBundle(bundle: CoordinationBundle): AgentLane[] {
  if (bundle.lanes && bundle.lanes.length > 0) {
    return bundle.lanes;
  }

  return bundle.agents.map((agent) => ({
    agentId: agent.id,
    label: agent.label ?? agent.id,
    role: agent.role,
    steps: [],
  }));
}

export function parseAgentLane(raw: unknown, index: number): AgentLane {
  if (!isRecord(raw)) {
    throw new Error(`coordination.lanes[${index}] must be an object`);
  }
  if (typeof raw.agentId !== "string") {
    throw new Error(`coordination.lanes[${index}] requires agentId`);
  }
  if (!Array.isArray(raw.steps)) {
    throw new Error(`coordination.lanes[${index}] requires steps array`);
  }
  return {
    agentId: raw.agentId,
    label: typeof raw.label === "string" ? raw.label : raw.agentId,
    role: typeof raw.role === "string" ? raw.role : "agent",
    steps: raw.steps.map(parseLaneStep),
  };
}
