import type { Trajectory } from "../types";
import { contextFidelity, missingPropagatedFields } from "./fidelity";
import { getCoordinationObservation } from "./observations";
import { diffAllHandoffs } from "./propagation-diff";
import { buildLanesFromBundle } from "./lanes";
import type {
  CoordinationBundle,
  CoordinationResult,
  CoordinationSignal,
  CoordinationSeverity,
  DelegationCoherenceLevel,
  HandoffRecord,
} from "./types";

function resolveDelegationCoherence(
  integrity: number,
): DelegationCoherenceLevel {
  if (integrity >= 72) return "aligned";
  if (integrity >= 45) return "weakening";
  return "incoherent";
}

function severityFromFidelity(fidelity: number): CoordinationSeverity {
  if (fidelity < 0.4) return "high";
  if (fidelity < 0.65) return "medium";
  return "low";
}

function analyzeHandoff(handoff: HandoffRecord): {
  fidelity: number;
  signals: CoordinationSignal[];
} {
  const fidelity = contextFidelity(
    handoff.expectedContext,
    handoff.actualContext,
  );
  const severity = severityFromFidelity(fidelity);
  const signals: CoordinationSignal[] = [];

  if (fidelity < 0.65) {
    signals.push({
      kind: fidelity < 0.4 ? "handoff_loss" : "context_mutation",
      handoffId: handoff.id,
      severity,
      interpretation: `${handoff.fromAgentId} → ${handoff.toAgentId}: propagated context diverged from contract (${Math.round(fidelity * 100)}% fidelity).`,
      suggestedCalibration:
        fidelity < 0.4
          ? "Re-establish handoff contract before downstream agents act"
          : "Validate propagated fields at handoff boundary",
    });
  }

  const fields = handoff.propagatedFields ?? [];
  const dropped = missingPropagatedFields(fields, handoff.actualContext);
  if (dropped.length > 0) {
    signals.push({
      kind: "memory_fragmentation",
      handoffId: handoff.id,
      severity: dropped.length >= 2 ? "high" : "medium",
      interpretation: `Fields not carried across handoff: ${dropped.join(", ")}.`,
      suggestedCalibration: "Require explicit propagation checklist at delegation boundary",
    });
  }

  if (
    handoff.actualContext.toLowerCase().includes("forum") &&
    handoff.expectedContext.toLowerCase().includes("kb")
  ) {
    signals.push({
      kind: "grounding_desync",
      handoffId: handoff.id,
      severity: "high",
      interpretation:
        "Grounding source desynchronized — expected authoritative retrieval, received unverified surface.",
      suggestedCalibration: "Pin grounding source in delegation contract",
    });
  }

  return { fidelity, signals };
}

function buildSummary(
  level: DelegationCoherenceLevel,
  signalCount: number,
  agentCount: number,
): string {
  if (level === "aligned") {
    return `${agentCount} agents · ${signalCount} coordination notes · delegation coherent`;
  }
  if (level === "weakening") {
    return `${agentCount} agents · coordination weakening · ${signalCount} handoff issues`;
  }
  return `${agentCount} agents · delegation incoherent · ${signalCount} coordination breaks`;
}

/** Analyze multi-agent handoffs and memory propagation — observable, not abstract. */
export function runCoordinationAnalysis(
  bundle: CoordinationBundle,
  _actual?: Trajectory,
): CoordinationResult {
  const fidelities: number[] = [];
  const signals: CoordinationSignal[] = [];

  for (const handoff of bundle.handoffs) {
    const { fidelity, signals: handoffSignals } = analyzeHandoff(handoff);
    fidelities.push(fidelity);
    signals.push(...handoffSignals);
  }

  const coordinationIntegrity =
    fidelities.length > 0
      ? Math.round(
          (fidelities.reduce((a, b) => a + b, 0) / fidelities.length) * 100,
        )
      : 100;

  const delegationCoherence = resolveDelegationCoherence(coordinationIntegrity);

  if (bundle.agents.length > 2 && signals.length >= 2) {
    signals.push({
      kind: "delegation_divergence",
      severity: "medium",
      interpretation:
        "Assumptions may be propagating faster than grounding across the delegation chain.",
      suggestedCalibration: "Add synchronization checkpoint before final synthesis",
    });
  }

  const propagationDiffs = diffAllHandoffs(bundle.handoffs);
  const mutatedCount = propagationDiffs.filter(
    (d) => d.status === "mutated" || d.status === "missing",
  ).length;
  if (mutatedCount >= 2) {
    signals.push({
      kind: "memory_fragmentation",
      severity: "high",
      interpretation: `${mutatedCount} field-level propagation breaks across handoffs.`,
      suggestedCalibration: "Audit field-level contracts at each delegation boundary",
    });
  }

  const lanes = buildLanesFromBundle(bundle);
  const observation = getCoordinationObservation(delegationCoherence);
  const summary = buildSummary(
    delegationCoherence,
    signals.length,
    bundle.agents.length,
  );

  return {
    scenario: bundle.scenario,
    agentCount: bundle.agents.length,
    handoffCount: bundle.handoffs.length,
    coordinationIntegrity,
    delegationCoherence,
    signals,
    propagationDiffs,
    lanes,
    handoffs: bundle.handoffs,
    observation,
    summary,
  };
}
