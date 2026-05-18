import type { CalibrationMemory, StabilityLevel } from "./types";

export interface RecoveryNote {
  id: string;
  tone: "stabilized" | "learning" | "ongoing";
  message: string;
}

export function buildRecoveryNotes(
  stabilityLevel: StabilityLevel,
  stabilized: boolean,
  memory: CalibrationMemory,
  corrections: string[],
): RecoveryNote[] {
  const notes: RecoveryNote[] = [];

  if (stabilized) {
    notes.push({
      id: "rec-stabilized",
      tone: "stabilized",
      message:
        "A prior run with similar drift patterns later stabilized. Prior calibrations may still apply.",
    });
  }

  if (corrections.length > 0 && stabilityLevel !== "stable") {
    notes.push({
      id: "rec-attempted",
      tone: "ongoing",
      message: `Adaptation in progress. Suggested adjustments: ${corrections.slice(0, 2).join("; ")}.`,
    });
  }

  const pastSuccess = memory.patterns.successfulCorrections;
  if (pastSuccess.length > 0) {
    notes.push({
      id: "rec-learned",
      tone: "learning",
      message: `What helped before: ${pastSuccess.slice(0, 2).join(", ")}.`,
    });
  }

  if (stabilityLevel === "stable" && notes.length === 0) {
    notes.push({
      id: "rec-hold",
      tone: "stabilized",
      message: "Trajectory continuity holds. Continue observing weak signals as context shifts.",
    });
  }

  return notes;
}
