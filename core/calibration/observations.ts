import type { StabilityLevel } from "./types";

/** Dry, observational lines — restrained, not performative. */
const OBSERVATIONS: Record<StabilityLevel, string[]> = {
  stable: [
    "Trajectory stable. Reality still worth checking.",
    "Coherence holds. Context may still shift.",
  ],
  unstable: [
    "The system remembered the tone. Forgot the facts.",
    "Coherence weakening. Confidence may not notice.",
  ],
  elevated_risk: [
    "The agent ignored retrieval again. Confidence remained excellent.",
    "Grounding unstable. The narrative continued anyway.",
  ],
};

export function getDryObservation(level: StabilityLevel): string {
  const lines = OBSERVATIONS[level];
  return lines[Math.floor(Math.random() * lines.length)];
}
