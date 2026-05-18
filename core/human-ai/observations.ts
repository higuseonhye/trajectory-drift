import type { HumanAiCoherenceLevel } from "./types";

const OBSERVATIONS: Record<HumanAiCoherenceLevel, string[]> = {
  stable: [
    "Human and agent rhythms aligned. Context held.",
    "Interaction coherent. Neither party rushed the narrative.",
  ],
  strained: [
    "The human corrected the tone. The facts remained optional.",
    "Async gaps widened. Coherence did not wait.",
  ],
  fatigued: [
    "Coordination fatigue detected. Confidence persisted anyway.",
    "The workflow continued. Grounding did not.",
  ],
};

export function getHumanAiObservation(level: HumanAiCoherenceLevel): string {
  const lines = OBSERVATIONS[level];
  return lines[Math.floor(Math.random() * lines.length)];
}
