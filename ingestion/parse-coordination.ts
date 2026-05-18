import { parseAgentLane } from "@/core/coordination/lanes";
import type { CoordinationAgent, CoordinationBundle, HandoffRecord } from "@/core";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAgent(raw: unknown, index: number): CoordinationAgent {
  if (!isRecord(raw)) {
    throw new Error(`coordination.agents[${index}] must be an object`);
  }
  if (typeof raw.id !== "string" || typeof raw.role !== "string") {
    throw new Error(`coordination.agents[${index}] requires id and role`);
  }
  return {
    id: raw.id,
    role: raw.role,
    label: typeof raw.label === "string" ? raw.label : undefined,
  };
}

function parseHandoff(raw: unknown, index: number): HandoffRecord {
  if (!isRecord(raw)) {
    throw new Error(`coordination.handoffs[${index}] must be an object`);
  }
  const required = [
    "id",
    "fromAgentId",
    "toAgentId",
    "intent",
    "expectedContext",
    "actualContext",
  ] as const;
  for (const key of required) {
    if (typeof raw[key] !== "string") {
      throw new Error(`coordination.handoffs[${index}].${key} must be a string`);
    }
  }
  const handoff: HandoffRecord = {
    id: raw.id as string,
    fromAgentId: raw.fromAgentId as string,
    toAgentId: raw.toAgentId as string,
    intent: raw.intent as string,
    expectedContext: raw.expectedContext as string,
    actualContext: raw.actualContext as string,
  };
  if (typeof raw.stepId === "string") handoff.stepId = raw.stepId;
  if (Array.isArray(raw.propagatedFields)) {
    handoff.propagatedFields = raw.propagatedFields.filter(
      (f): f is string => typeof f === "string",
    );
  }
  if (isRecord(raw.expectedFields)) {
    handoff.expectedFields = Object.fromEntries(
      Object.entries(raw.expectedFields).filter(
        (e): e is [string, string] => typeof e[1] === "string",
      ),
    );
  }
  if (isRecord(raw.actualFields)) {
    handoff.actualFields = Object.fromEntries(
      Object.entries(raw.actualFields).filter(
        (e): e is [string, string] => typeof e[1] === "string",
      ),
    );
  }
  return handoff;
}

/** Returns bundle when payload includes a `coordination` block; otherwise undefined. */
export function parseCoordinationBundle(
  json: unknown,
): CoordinationBundle | undefined {
  if (!isRecord(json) || json.coordination === undefined) return undefined;

  const block = json.coordination;
  if (!isRecord(block)) {
    throw new Error("coordination must be an object");
  }
  if (!Array.isArray(block.agents) || !Array.isArray(block.handoffs)) {
    throw new Error("coordination requires agents and handoffs arrays");
  }

  const bundle: CoordinationBundle = {
    scenario: typeof block.scenario === "string" ? block.scenario : undefined,
    agents: block.agents.map(parseAgent),
    handoffs: block.handoffs.map(parseHandoff),
  };
  if (Array.isArray(block.lanes)) {
    bundle.lanes = block.lanes.map(parseAgentLane);
  }
  return bundle;
}
