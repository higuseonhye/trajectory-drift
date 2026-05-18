import type { ContextQualitySignal } from "./context-quality";
import type { RecoveryNote } from "./recovery";
import type { CalibrationInsight, CalibrationMemory } from "./types";

export interface JournalEntry {
  id: string;
  recordedAt: string;
  observed: string;
  interpretation: string;
  adaptation?: string;
  outcome?: string;
}

export function buildJournalEntries(
  insights: CalibrationInsight[],
  contextSignals: ContextQualitySignal[],
  recoveryNotes: RecoveryNote[],
  memory: CalibrationMemory,
  trajectoryId: string,
): JournalEntry[] {
  const entries: JournalEntry[] = [];
  const now = new Date().toISOString();

  for (const insight of insights) {
    entries.push({
      id: `j-${insight.id}`,
      recordedAt: now,
      observed: insight.instabilityFactors[0] ?? "Behavioral drift observed",
      interpretation: insight.interpretation,
      adaptation: insight.suggestedCalibration.map((c) => c.label).join(" · "),
      outcome: undefined,
    });
  }

  for (const signal of contextSignals) {
    entries.push({
      id: `j-ctx-${signal.kind}`,
      recordedAt: now,
      observed: signal.kind.replace(/_/g, " "),
      interpretation: signal.interpretation,
    });
  }

  for (const note of recoveryNotes) {
    entries.push({
      id: `j-${note.id}`,
      recordedAt: now,
      observed: "Recovery",
      interpretation: note.message,
      outcome: note.tone === "stabilized" ? "Stabilized" : undefined,
    });
  }

  for (const mem of memory.entries.slice(0, 3)) {
    if (mem.actualTrajectoryId === trajectoryId) continue;
    entries.push({
      id: `j-mem-${mem.id}`,
      recordedAt: mem.recordedAt,
      observed: mem.driftKinds.join(", ") || "Prior run",
      interpretation: mem.interpretation ?? "Recorded in adaptation memory",
      adaptation: mem.corrections.join(" · ") || undefined,
      outcome: mem.stabilized ? "Stabilized afterward" : "Adaptation incomplete",
    });
  }

  return entries;
}
