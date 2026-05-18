"use client";

import type { CalibrationResult } from "@/core";

interface RecoveryPanelProps {
  calibration: CalibrationResult | null;
}

export function RecoveryPanel({ calibration }: RecoveryPanelProps) {
  if (!calibration || calibration.recovery.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[var(--border-subtle)] px-4 py-4">
      <p className="label-caps">Recovery</p>
      <ul className="mt-3 space-y-2">
        {calibration.recovery.map((note) => (
          <li key={note.id} className="text-sm leading-relaxed text-zinc-500">
            {note.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
