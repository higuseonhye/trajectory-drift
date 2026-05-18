import type { OrgMemoryEntry, OrgMemoryStore } from "./types";

export function createEmptyOrgMemory(teamId = "default"): OrgMemoryStore {
  return {
    teamId,
    entries: [],
    lastUpdated: new Date().toISOString(),
  };
}

export function recordOrgPattern(
  store: OrgMemoryStore,
  pattern: string,
  resolution?: string,
): OrgMemoryStore {
  const entry: OrgMemoryEntry = {
    id: `org-${Date.now()}`,
    teamId: store.teamId,
    recordedAt: new Date().toISOString(),
    pattern,
    resolution,
  };
  const entries = [entry, ...store.entries].slice(0, 50);
  return {
    teamId: store.teamId,
    entries,
    lastUpdated: new Date().toISOString(),
  };
}
