import type { DriftIssueKind } from "../types";
import type {
  CalibrationMemory,
  CalibrationMemoryEntry,
  CalibrationResult,
  StabilityLevel,
} from "./types";

export function createEmptyMemory(): CalibrationMemory {
  return { entries: [], patterns: { recurringDriftKinds: [], successfulCorrections: [] } };
}

export function recordCalibrationEvent(
  memory: CalibrationMemory,
  input: {
    actualTrajectoryId: string;
    stabilityLevel: StabilityLevel;
    driftKinds: DriftIssueKind[];
    corrections: string[];
    stabilized: boolean;
    interpretation?: string;
  },
): CalibrationMemory {
  const entry: CalibrationMemoryEntry = {
    id: `mem-${Date.now()}`,
    recordedAt: new Date().toISOString(),
    actualTrajectoryId: input.actualTrajectoryId,
    stabilityLevel: input.stabilityLevel,
    driftKinds: input.driftKinds,
    corrections: input.corrections,
    stabilized: input.stabilized,
    interpretation: input.interpretation,
  };

  const entries = [entry, ...memory.entries].slice(0, 50);

  const kindCounts = new Map<DriftIssueKind, number>();
  for (const e of entries) {
    for (const k of e.driftKinds) {
      kindCounts.set(k, (kindCounts.get(k) ?? 0) + 1);
    }
  }
  const recurringDriftKinds = [...kindCounts.entries()]
    .filter(([, c]) => c >= 2)
    .map(([k]) => k);

  const successfulCorrections = entries
    .filter((e) => e.stabilized)
    .flatMap((e) => e.corrections);

  return {
    entries,
    patterns: {
      recurringDriftKinds,
      successfulCorrections: [...new Set(successfulCorrections)].slice(0, 10),
    },
  };
}

export function memoryContextNote(memory: CalibrationMemory): string | null {
  if (memory.entries.length === 0) return null;

  const parts: string[] = [];
  if (memory.patterns.recurringDriftKinds.length > 0) {
    parts.push(
      `Recurring adaptation gaps: ${memory.patterns.recurringDriftKinds.join(", ")}.`,
    );
  }
  const stabilized = memory.entries.filter((e) => e.stabilized).length;
  if (stabilized > 0) {
    parts.push(
      `${stabilized} prior run(s) stabilized after calibration — prior corrections may still apply.`,
    );
  }
  return parts.length > 0 ? parts.join(" ") : null;
}

export function inferStabilized(
  stabilityLevel: StabilityLevel,
  priorMemory: CalibrationMemory,
  trajectoryId: string,
): boolean {
  const prior = priorMemory.entries.find(
    (e) => e.actualTrajectoryId === trajectoryId,
  );
  if (!prior) return stabilityLevel === "stable";
  return (
    stabilityLevel === "stable" &&
    (prior.stabilityLevel === "unstable" || prior.stabilityLevel === "elevated_risk")
  );
}
