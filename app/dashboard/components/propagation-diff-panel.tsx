"use client";

import type { FieldPropagationDiff } from "@/core";

const STATUS_LABEL: Record<FieldPropagationDiff["status"], string> = {
  aligned: "aligned",
  mutated: "mutated",
  missing: "missing",
  unexpected: "unexpected",
};

interface PropagationDiffPanelProps {
  diffs: FieldPropagationDiff[];
}

export function PropagationDiffPanel({ diffs }: PropagationDiffPanelProps) {
  const issues = diffs.filter((d) => d.status !== "aligned");
  if (diffs.length === 0) return null;

  return (
    <section className="panel p-6">
      <p className="label-caps">Field propagation</p>
      <p className="mt-2 prose-calm">
        Per-field diff across handoff boundaries — {issues.length} break
        {issues.length === 1 ? "" : "s"} of {diffs.length} fields.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-600">
              <th className="py-2 pr-3 font-medium">Handoff</th>
              <th className="py-2 pr-3 font-medium">Field</th>
              <th className="py-2 pr-3 font-medium">Expected</th>
              <th className="py-2 pr-3 font-medium">Actual</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {diffs.map((d) => (
              <tr
                key={`${d.handoffId}-${d.field}`}
                className="border-b border-zinc-900/80"
              >
                <td className="py-2 pr-3 text-zinc-500">{d.handoffId}</td>
                <td className="py-2 pr-3 font-mono text-zinc-400">{d.field}</td>
                <td className="py-2 pr-3 text-zinc-500">{d.expected ?? "—"}</td>
                <td className="py-2 pr-3 text-zinc-500">{d.actual ?? "—"}</td>
                <td
                  className={`py-2 ${
                    d.status === "aligned"
                      ? "text-zinc-600"
                      : d.status === "mutated"
                        ? "text-amber-600/90"
                        : "text-rose-500/90"
                  }`}
                >
                  {STATUS_LABEL[d.status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
