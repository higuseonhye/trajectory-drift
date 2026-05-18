"use client";

import type { DriftAnalysisResult, DriftIssueKind } from "@/core";
import { formatPercent } from "../lib/drift-steps";

const KIND_LABELS: Record<DriftIssueKind, string> = {
  missing_step: "Missing step",
  hallucination: "Hallucination",
  deviation: "Deviation",
};

const SEVERITY_STYLES: Record<string, string> = {
  low: "bg-amber-500/15 text-amber-400",
  medium: "bg-orange-500/15 text-orange-400",
  high: "bg-red-500/15 text-red-400",
};

interface DriftScorePanelProps {
  result: DriftAnalysisResult | null;
  loading?: boolean;
}

function ScoreBar({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{label}</span>
        <span className="font-mono text-zinc-300">{formatPercent(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${accent}`}
          style={{ width: `${Math.min(100, value * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function DriftScorePanel({ result, loading }: DriftScorePanelProps) {
  if (loading || !result) {
    return (
      <div className="panel flex h-full flex-col justify-center p-6 text-sm text-zinc-500">
        {loading ? "Computing drift score…" : "Awaiting analysis."}
      </div>
    );
  }

  const { scores, issues } = result;

  return (
    <div className="panel flex h-full flex-col gap-5 p-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Drift score
        </p>
        <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight text-red-400">
          {formatPercent(scores.driftScore)}
        </p>
        <p className="mt-1 truncate font-mono text-[10px] text-zinc-600">
          {result.referenceTrajectoryId} → {result.actualTrajectoryId}
        </p>
      </div>

      <ScoreBar
        label="Embedding drift"
        value={scores.embeddingScore}
        accent="bg-indigo-500"
      />
      <ScoreBar
        label="Rule-based drift"
        value={scores.ruleScore}
        accent="bg-violet-500"
      />

      <div className="flex-1 overflow-hidden">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Issues ({issues.length})
        </p>
        <ul className="max-h-52 space-y-2 overflow-y-auto pr-1">
          {issues.length === 0 ? (
            <li className="text-sm text-zinc-500">No drift detected.</li>
          ) : (
            issues.map((issue, i) => (
              <li
                key={`${issue.kind}-${i}`}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5"
              >
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-medium text-red-400">
                    {KIND_LABELS[issue.kind]}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${SEVERITY_STYLES[issue.severity]}`}
                  >
                    {issue.severity}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-400">
                  {issue.message}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
