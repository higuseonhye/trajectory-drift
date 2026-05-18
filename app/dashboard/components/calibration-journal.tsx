"use client";

import type { CalibrationResult } from "@/core";

interface CalibrationJournalProps {
  calibration: CalibrationResult | null;
}

export function CalibrationJournal({ calibration }: CalibrationJournalProps) {
  if (!calibration || calibration.journal.length === 0) {
    return null;
  }

  return (
    <section className="panel p-6">
      <p className="label-caps">Calibration journal</p>
      <p className="mt-1 text-sm text-zinc-400">
        Observed · interpreted · adapted · outcome
      </p>
      <ol className="mt-6 space-y-6">
        {calibration.journal.map((entry) => (
          <li
            key={entry.id}
            className="grid gap-2 border-b border-[var(--border-subtle)] pb-6 last:border-0 last:pb-0 sm:grid-cols-[1fr_2fr]"
          >
            <div>
              <p className="text-xs text-zinc-500">{entry.observed}</p>
              {entry.outcome && (
                <p className="mt-1 text-xs text-zinc-600">{entry.outcome}</p>
              )}
            </div>
            <div>
              <p className="text-sm leading-relaxed text-zinc-300">
                {entry.interpretation}
              </p>
              {entry.adaptation && (
                <p className="mt-2 text-xs text-zinc-500">
                  Adaptation: {entry.adaptation}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
