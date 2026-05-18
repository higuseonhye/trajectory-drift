export interface OrgPolicy {
  id: string;
  summary: string;
  lastReinforced?: string;
}

export interface OrgIncident {
  id: string;
  summary: string;
  resolution?: string;
  occurredAt?: string;
}

export interface OrgMemoryBundle {
  teamId?: string;
  policies: OrgPolicy[];
  incidents?: OrgIncident[];
}

export interface OrgMemoryEntry {
  id: string;
  teamId: string;
  recordedAt: string;
  pattern: string;
  resolution?: string;
}

export interface OrgMemoryStore {
  teamId: string;
  entries: OrgMemoryEntry[];
  lastUpdated: string;
}

export type OrgCoherenceLevel = "aligned" | "stale" | "contaminated";

export interface OrgCoherenceSignal {
  kind: "policy_drift" | "incident_repeat" | "stale_policy" | "memory_fragmentation";
  severity: "low" | "medium" | "high";
  interpretation: string;
  suggestedCalibration?: string;
}

export interface OrgMemoryResult {
  teamId: string;
  level: OrgCoherenceLevel;
  /** 0–100 — organizational memory coherence. */
  coherenceScore: number;
  policyCount: number;
  incidentCount: number;
  signals: OrgCoherenceSignal[];
  observation: string;
  summary: string;
  /** Patterns persisted for this team (from store + current run). */
  persistedPatterns: OrgMemoryEntry[];
}
