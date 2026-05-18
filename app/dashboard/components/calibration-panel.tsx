"use client";

import type { CalibrationInsight, CalibrationResult } from "@/core";
import { RecoveryPanel } from "./recovery-panel";

interface CalibrationPanelProps {
  calibration: CalibrationResult | null;
  loading?: boolean;
  selectedInsightId?: string | null;
  onSelectInsight?: (insight: CalibrationInsight) => void;
}

export function CalibrationPanel({
  calibration,
  loading = false,
  selectedInsightId,
  onSelectInsight,
}: CalibrationPanelProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-l border-[var(--border-subtle)] bg-[var(--surface)] lg:w-80 xl:w-96">
      <div className="px-5 py-5">
        <p className="label-caps">Recalibration</p>
        <p className="mt-1 text-sm text-zinc-500">
          Interpret · adjust · learn
        </p>
      </div>

      {loading ? (
        <p className="flex flex-1 items-center justify-center p-8 prose-calm">
          Reflecting on this run…
        </p>
      ) : !calibration ? (
        <p className="flex flex-1 items-center justify-center p-8 prose-calm">
          No data yet.
        </p>
      ) : (
        <>
          <div className="border-t border-[var(--border-subtle)] px-5 py-4">
            <p className="prose-calm">{calibration.globalSummary}</p>
          </div>

          <ul className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
            {calibration.insights.map((insight) => (
              <li key={insight.id}>
                <button
                  type="button"
                  onClick={() => onSelectInsight?.(insight)}
                  className={`w-full rounded-md px-3 py-3 text-left transition ${
                    selectedInsightId === insight.id
                      ? "bg-zinc-800/60"
                      : "hover:bg-zinc-800/30"
                  }`}
                >
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {insight.interpretation}
                  </p>
                  {insight.suggestedCalibration.length > 0 && (
                    <p className="mt-2 text-xs text-zinc-600">
                      {insight.suggestedCalibration
                        .map((c) => c.label)
                        .join(" · ")}
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <RecoveryPanel calibration={calibration} />
        </>
      )}
    </aside>
  );
}
