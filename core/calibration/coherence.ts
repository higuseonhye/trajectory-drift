import type { StabilityLevel } from "./types";

/** Behavioral signals — not judgment metrics. */
export interface CoherenceIndicator {
  level: StabilityLevel;
  label: string;
  description: string;
}

export const COHERENCE_INDICATORS: Record<StabilityLevel, CoherenceIndicator> = {
  stable: {
    level: "stable",
    label: "Trajectory stable",
    description: "Behavioral continuity aligns with the reference model.",
  },
  unstable: {
    level: "unstable",
    label: "Coherence weakening",
    description: "Grounding or adaptation may be drifting — worth recalibrating.",
  },
  elevated_risk: {
    level: "elevated_risk",
    label: "Grounding unstable",
    description: "Context quality or adaptation appears incomplete under current conditions.",
  },
};

export function getCoherenceIndicator(level: StabilityLevel): CoherenceIndicator {
  return COHERENCE_INDICATORS[level];
}
