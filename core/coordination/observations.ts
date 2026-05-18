import type { DelegationCoherenceLevel } from "./types";

const OBSERVATIONS: Record<DelegationCoherenceLevel, string[]> = {
  aligned: [
    "The agents agreed. Grounding was consulted.",
    "Delegation held. Context propagated as intended.",
  ],
  weakening: [
    "Memory continuity weakened after recursive delegation.",
    "The handoff preserved intent. The facts became negotiable.",
  ],
  incoherent: [
    "The agents agreed confidently. Grounding remained unresolved.",
    "Delegation completed. Synchronization did not.",
  ],
};

export function getCoordinationObservation(
  level: DelegationCoherenceLevel,
): string {
  const lines = OBSERVATIONS[level];
  return lines[Math.floor(Math.random() * lines.length)];
}
