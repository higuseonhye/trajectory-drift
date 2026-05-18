import type { AgentStep, Trajectory } from "../types";
import type { WeakSignal, WeakSignalKind } from "./types";

function consecutiveKindRuns(steps: AgentStep[], kind: string): number[] {
  const runs: number[] = [];
  let run = 0;
  for (const step of steps) {
    if (step.kind === kind) {
      run++;
    } else if (run > 0) {
      runs.push(run);
      run = 0;
    }
  }
  if (run > 0) runs.push(run);
  return runs;
}

function contentHints(step: AgentStep, patterns: RegExp[]): boolean {
  const text = `${step.label} ${step.content}`.toLowerCase();
  return patterns.some((p) => p.test(text));
}

export function detectWeakSignals(
  actual: Trajectory,
  reference: Trajectory,
): WeakSignal[] {
  const steps = actual.steps;
  const signals: WeakSignal[] = [];

  const retrySteps = steps.filter((s) =>
    contentHints(s, [/retry/i, /again/i, /re-attempt/i]),
  );
  if (retrySteps.length > 0) {
    signals.push({
      kind: "retry_pattern",
      interpretation:
        "Repeated retry patterns suggest the system is compensating for unresolved uncertainty rather than recalibrating its approach.",
      stepIds: retrySteps.map((s) => s.id),
      weight: 0.35,
    });
  }

  const thoughtRuns = consecutiveKindRuns(steps, "thought");
  if (thoughtRuns.some((r) => r >= 2) || steps.filter((s) => s.kind === "thought").length >= 3) {
    const thoughtIds = steps.filter((s) => s.kind === "thought").map((s) => s.id);
    signals.push({
      kind: "hesitation_loop",
      interpretation:
        "Extended planning loops may indicate hesitation — the trajectory is deliberating without committing to grounding actions.",
      stepIds: thoughtIds,
      weight: 0.4,
    });
  }

  const refHasRetrieve = reference.steps.some((s) =>
    /retrieve|knowledge|kb/i.test(s.content),
  );
  const actRetrieve = steps.filter((s) => /retrieve|knowledge|kb/i.test(s.content));
  const actWebSearch = steps.filter((s) => /web_search|search\(/i.test(s.content));

  if (refHasRetrieve && actRetrieve.length === 0 && actWebSearch.length > 0) {
    signals.push({
      kind: "retrieval_avoidance",
      interpretation:
        "The run appears to avoid canonical retrieval in favor of alternate lookup paths — a common precursor to grounding drift.",
      stepIds: actWebSearch.map((s) => s.id),
      weight: 0.55,
    });
  }

  if (actRetrieve.length > 0 && refHasRetrieve) {
    const mismatch = actRetrieve.some(
      (s) => !reference.steps.some((r) => r.kind === s.kind && r.label === s.label),
    );
    if (mismatch) {
      signals.push({
        kind: "retrieval_inconsistency",
        interpretation:
          "Retrieval behavior differs from the reference calibration — grounding sources may be unstable across runs.",
        stepIds: actRetrieve.map((s) => s.id),
        weight: 0.45,
      });
    }
  }

  for (let i = 0; i < steps.length - 2; i++) {
    const window = steps.slice(i, i + 3).map((s) => s.kind);
    const volatile =
      new Set(window).size === 3 &&
      window.includes("thought") &&
      (window.includes("decision") || window.includes("response"));
    if (volatile && !window.includes("observation")) {
      signals.push({
        kind: "chain_instability",
        interpretation:
          "Rapid transitions across step types without observational anchoring can weaken trajectory continuity.",
        stepIds: steps.slice(i, i + 3).map((s) => s.id),
        weight: 0.5,
      });
      break;
    }
  }

  const carrySteps = steps.filter((s) =>
    contentHints(s, [/carry[- ]?over/i, /previous context/i, /from earlier/i, /without.*ground/i]),
  );
  if (carrySteps.length > 0) {
    signals.push({
      kind: "context_carryover",
      interpretation:
        "The system may be over-weighting conversational carry-over relative to fresh grounding signals.",
      stepIds: carrySteps.map((s) => s.id),
      weight: 0.5,
    });
  }

  return dedupeSignals(signals);
}

function dedupeSignals(signals: WeakSignal[]): WeakSignal[] {
  const byKind = new Map<WeakSignalKind, WeakSignal>();
  for (const s of signals) {
    const existing = byKind.get(s.kind);
    if (!existing || s.weight > existing.weight) {
      byKind.set(s.kind, s);
    }
  }
  return [...byKind.values()];
}
