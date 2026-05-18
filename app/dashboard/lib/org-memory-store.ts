import type { OrgMemoryStore } from "@/core";
import { createEmptyOrgMemory } from "@/core";

const STORAGE_KEY = "trajectory-drift:org-memory";

export function loadOrgMemory(teamId?: string): OrgMemoryStore {
  if (typeof window === "undefined") {
    return createEmptyOrgMemory(teamId ?? "default");
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyOrgMemory(teamId ?? "default");
    const parsed = JSON.parse(raw) as OrgMemoryStore;
    if (teamId && parsed.teamId !== teamId) {
      return createEmptyOrgMemory(teamId);
    }
    return parsed;
  } catch {
    return createEmptyOrgMemory(teamId ?? "default");
  }
}

export function saveOrgMemory(store: OrgMemoryStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors
  }
}
