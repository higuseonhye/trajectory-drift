"use client";

import type { CalibrationInsight, CalibrationResult } from "@/core";

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
    <aside className="flex w-full shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)] lg:w-[22rem] xl:w-[26rem]">
      <div className="border-b border-[var(--border)] px-4 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Calibration layer
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">
          Interpret → recalibrate → adapt
        </p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-zinc-500">
          Interpreting trajectory behavior…
        </div>
      ) : !calibration ? (
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-zinc-500">
          No calibration data.
        </div>
      ) : (
        <>
          <div className="border-b border-[var(--border)] px-4 py-4">
            <p className="text-xs leading-relaxed text-zinc-400">
              {calibration.globalSummary}
            </p>
          </div>

          {calibration.memory.entries.length > 0 && (
            <div className="border-b border-[var(--border)] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                Calibration memory
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                {calibration.memory.entries.length} recorded adaptation
                {calibration.memory.entries.length === 1 ? "" : "s"}
                {calibration.memory.patterns.recurringDriftKinds.length > 0 && (
                  <>
                    {" "}
                    · recurring:{" "}
                    {calibration.memory.patterns.recurringDriftKinds.join(", ")}
                  </>
                )}
              </p>
            </div>
          )}

          <ul className="flex-1 space-y-2 overflow-y-auto p-3">
            {calibration.insights.length === 0 ? (
              <li className="px-2 text-sm text-zinc-500">
                No recalibration points required.
              </li>
            ) : (
              calibration.insights.map((insight) => (
                <li key={insight.id}>
                  <button
                    type="button"
                    onClick={() => onSelectInsight?.(insight)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      selectedInsightId === insight.id
                        ? "border-blue-500/40 bg-blue-500/5"
                        : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-zinc-600"
                    }`}
                  >
                    {insight.relatedIssueKind && (
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                        {insight.relatedIssueKind.replace(/_/g, " ")}
                      </p>
                    )}

                    <p className="text-xs leading-relaxed text-zinc-300">
                      {insight.interpretation}
                    </p>

                    <ul className="mt-2 space-y-1">
                      {insight.instabilityFactors.map((f) => (
                        <li
                          key={f}
                          className="text-[10px] text-zinc-600 before:mr-1.5 before:content-['·']"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 border-t border-[var(--border)] pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                        Suggested calibration
                      </p>
                      <ul className="mt-2 space-y-2">
                        {insight.suggestedCalibration.map((action) => (
                          <li key={action.label}>
                            <p className="text-xs font-medium text-zinc-300">
                              {action.label}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                              {action.rationale}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </aside>
  );
}
