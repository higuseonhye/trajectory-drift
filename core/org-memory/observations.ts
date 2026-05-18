import type { OrgCoherenceLevel } from "./types";

const OBSERVATIONS: Record<OrgCoherenceLevel, string[]> = {
  aligned: [
    "Organizational memory aligned with current workflow.",
    "Team policies reinforced. Prior incidents remembered.",
  ],
  stale: [
    "Policy memory is older than the workflow pretending to follow it.",
    "The team remembered the process. The facts moved on.",
  ],
  contaminated: [
    "A prior incident pattern may be repeating. Grounding did not.",
    "Org memory carried forward. Verification did not.",
  ],
};

export function getOrgMemoryObservation(level: OrgCoherenceLevel): string {
  const lines = OBSERVATIONS[level];
  return lines[Math.floor(Math.random() * lines.length)];
}
