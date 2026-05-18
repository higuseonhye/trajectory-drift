import type { OrgIncident, OrgMemoryBundle, OrgPolicy } from "@/core";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePolicy(raw: unknown, index: number): OrgPolicy {
  if (!isRecord(raw) || typeof raw.id !== "string" || typeof raw.summary !== "string") {
    throw new Error(`orgMemory.policies[${index}] requires id and summary`);
  }
  return {
    id: raw.id,
    summary: raw.summary,
    lastReinforced:
      typeof raw.lastReinforced === "string" ? raw.lastReinforced : undefined,
  };
}

function parseIncident(raw: unknown, index: number): OrgIncident {
  if (!isRecord(raw) || typeof raw.id !== "string" || typeof raw.summary !== "string") {
    throw new Error(`orgMemory.incidents[${index}] requires id and summary`);
  }
  return {
    id: raw.id,
    summary: raw.summary,
    resolution: typeof raw.resolution === "string" ? raw.resolution : undefined,
    occurredAt: typeof raw.occurredAt === "string" ? raw.occurredAt : undefined,
  };
}

export function parseOrgMemoryBundle(json: unknown): OrgMemoryBundle | undefined {
  if (!isRecord(json) || json.orgMemory === undefined) return undefined;
  const block = json.orgMemory;
  if (!isRecord(block) || !Array.isArray(block.policies)) {
    throw new Error("orgMemory requires policies array");
  }
  return {
    teamId: typeof block.teamId === "string" ? block.teamId : undefined,
    policies: block.policies.map(parsePolicy),
    incidents: Array.isArray(block.incidents)
      ? block.incidents.map(parseIncident)
      : undefined,
  };
}
