"use client";

import type { DriftReport, DriftReportEntry } from "@/core";

const KIND_LABELS: Record<DriftReportEntry["kind"], string> = {
  missing_step: "Missing step",
  hallucination: "Hallucination",
  deviation: "Deviation",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "text-amber-400",
  medium: "text-orange-400",
  high: "text-red-400",
};

function severityBarColor(score: number): string {
  if (score >= 70) return "bg-red-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-amber-500";
}

interface ReportSidebarProps {
  report: DriftReport | null;
  loading?: boolean;
  selectedEntryId?: string | null;
  onSelectEntry?: (entry: DriftReportEntry) => void;
}

export function ReportSidebar({
  report,
  loading = false,
  selectedEntryId,
  onSelectEntry,
}: ReportSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)] lg:w-[22rem] xl:w-96">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Drift report
        </h2>
        <p className="mt-0.5 text-sm font-medium text-zinc-200">
          Findings & remediation
        </p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-zinc-500">
          Generating report…
        </div>
      ) : !report ? (
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-zinc-500">
          No report available.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 border-b border-[var(--border)] p-4 text-center">
            <div>
              <p className="text-xl font-semibold tabular-nums text-zinc-100">
                {report.summary.overallDriftPercent}%
              </p>
              <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                Drift
              </p>
            </div>
            <div>
              <p className="text-xl font-semibold tabular-nums text-zinc-100">
                {report.summary.totalFindings}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                Findings
              </p>
            </div>
            <div>
              <p className="text-xl font-semibold tabular-nums text-red-400">
                {report.summary.highSeverityCount}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                High
              </p>
            </div>
          </div>

          <ul className="flex-1 space-y-2 overflow-y-auto p-3">
            {report.entries.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onSelectEntry?.(entry)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    selectedEntryId === entry.id
                      ? "border-blue-500/50 bg-blue-500/5 ring-1 ring-blue-500/30"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-zinc-600"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-red-400">
                      {KIND_LABELS[entry.kind]}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase ${SEVERITY_COLORS[entry.severity]}`}
                    >
                      {entry.severity}
                    </span>
                  </div>

                  <p className="mb-2 font-mono text-[10px] leading-snug text-zinc-400">
                    {entry.driftLocation}
                  </p>

                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-[10px] text-zinc-600">
                      <span>Severity</span>
                      <span className="font-mono text-zinc-300">
                        {entry.severityScore}/100
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${severityBarColor(entry.severityScore)}`}
                        style={{ width: `${entry.severityScore}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-600">
                    Likely cause
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
                    {entry.likelyCause}
                  </p>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-zinc-600">
                    Suggested fix
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-300">
                    {entry.suggestedFix}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
