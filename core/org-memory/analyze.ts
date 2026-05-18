import type { CoordinationResult } from "../coordination/types";
import type { CalibrationResult } from "../calibration/types";
import { getOrgMemoryObservation } from "./observations";
import type {
  OrgCoherenceLevel,
  OrgCoherenceSignal,
  OrgMemoryBundle,
  OrgMemoryResult,
  OrgMemoryStore,
} from "./types";

function resolveLevel(score: number): OrgCoherenceLevel {
  if (score >= 75) return "aligned";
  if (score >= 50) return "stale";
  return "contaminated";
}

/** Compare run behavior against org policies, incidents, and persisted patterns. */
export function runOrgMemoryAnalysis(
  bundle: OrgMemoryBundle,
  store: OrgMemoryStore,
  options?: {
    coordination?: CoordinationResult;
    calibration?: CalibrationResult;
  },
): OrgMemoryResult {
  const signals: OrgCoherenceSignal[] = [];
  let score = 80;
  const teamId = bundle.teamId ?? store.teamId;

  const incidents = bundle.incidents ?? [];
  const coordination = options?.coordination;
  const calibration = options?.calibration;

  if (coordination?.delegationCoherence === "incoherent") {
    score -= 25;
    signals.push({
      kind: "policy_drift",
      severity: "high",
      interpretation:
        "Current run diverges from org delegation norms — coordination incoherent.",
      suggestedCalibration: "Reinforce team handoff contract in org playbook",
    });
  }

  const forumIncident = incidents.find((i) =>
    /forum|unverified|drift/i.test(i.summary),
  );
  if (
    forumIncident &&
    coordination &&
    coordination.coordinationIntegrity < 50
  ) {
    score -= 20;
    signals.push({
      kind: "incident_repeat",
      severity: "high",
      interpretation: `Pattern resembles prior incident "${forumIncident.id}": ${forumIncident.summary}`,
      suggestedCalibration:
        forumIncident.resolution ?? "Apply prior incident resolution",
    });
  }

  const stalePolicies = bundle.policies.filter((p) => {
    if (!p.lastReinforced) return false;
    const reinforced = new Date(p.lastReinforced).getTime();
    const ageDays = (Date.now() - reinforced) / (1000 * 60 * 60 * 24);
    return ageDays > 90;
  });
  if (stalePolicies.length > 0) {
    score -= 10;
    signals.push({
      kind: "stale_policy",
      severity: "medium",
      interpretation: `${stalePolicies.length} team policy(ies) not reinforced in 90+ days.`,
      suggestedCalibration: "Schedule policy reinforcement before high-risk workflows",
    });
  }

  if (calibration && calibration.stabilityLevel === "elevated_risk") {
    score -= 12;
    signals.push({
      kind: "memory_fragmentation",
      severity: "medium",
      interpretation:
        "Run-level instability may fragment shared organizational context.",
    });
  }

  const repeatedStorePattern = store.entries.find((e) =>
    incidents.some((i) => i.summary.toLowerCase().includes(e.pattern.toLowerCase().slice(0, 20))),
  );
  if (repeatedStorePattern) {
    score -= 8;
    signals.push({
      kind: "incident_repeat",
      severity: "low",
      interpretation: `Similar pattern recorded ${repeatedStorePattern.recordedAt.slice(0, 10)}.`,
    });
  }

  score = Math.max(0, Math.min(100, score));
  const level = resolveLevel(score);

  return {
    teamId,
    level,
    coherenceScore: score,
    policyCount: bundle.policies.length,
    incidentCount: incidents.length,
    signals,
    observation: getOrgMemoryObservation(level),
    summary:
      level === "aligned"
        ? `${bundle.policies.length} policies · org memory coherent`
        : level === "stale"
          ? `${bundle.policies.length} policies · org memory stale`
          : `Org memory contaminated · ${signals.length} signals`,
    persistedPatterns: store.entries.slice(0, 8),
  };
}
