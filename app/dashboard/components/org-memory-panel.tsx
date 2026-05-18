"use client";

import type { OrgMemoryResult } from "@/core";

const LEVEL_META: Record<
  OrgMemoryResult["level"],
  { label: string; description: string }
> = {
  aligned: {
    label: "Org memory aligned",
    description: "Team policies and incident history support this workflow.",
  },
  stale: {
    label: "Org memory stale",
    description: "Institutional context may be older than current behavior.",
  },
  contaminated: {
    label: "Org memory contaminated",
    description: "Prior incident patterns or policy drift may be propagating.",
  },
};

interface OrgMemoryPanelProps {
  orgMemory: OrgMemoryResult;
}

export function OrgMemoryPanel({ orgMemory }: OrgMemoryPanelProps) {
  const meta = LEVEL_META[orgMemory.level];

  return (
    <section className="panel p-6">
      <p className="label-caps">Organizational memory</p>
      <p className="mt-1 text-xs text-zinc-600">Team · {orgMemory.teamId}</p>
      <p className="mt-3 text-lg font-medium tracking-tight text-zinc-200">
        {meta.label}
      </p>
      <p className="mt-2 prose-calm">{meta.description}</p>
      <p className="mt-4 border-l border-zinc-700 pl-3 text-sm italic text-zinc-500">
        {orgMemory.observation}
      </p>
      <div className="mt-6 flex gap-8">
        <div>
          <p className="label-caps">Coherence</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {orgMemory.coherenceScore}
          </p>
        </div>
        <div>
          <p className="label-caps">Policies</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {orgMemory.policyCount}
          </p>
        </div>
        <div>
          <p className="label-caps">Incidents</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {orgMemory.incidentCount}
          </p>
        </div>
      </div>
      {orgMemory.signals.length > 0 && (
        <ul className="mt-6 space-y-3">
          {orgMemory.signals.map((s) => (
            <li key={s.interpretation} className="border-l border-zinc-700 pl-3">
              <p className="prose-calm">{s.interpretation}</p>
            </li>
          ))}
        </ul>
      )}
      {orgMemory.persistedPatterns.length > 0 && (
        <div className="mt-6">
          <p className="label-caps mb-2">Persisted patterns</p>
          <ul className="space-y-2 text-xs text-zinc-600">
            {orgMemory.persistedPatterns.map((e) => (
              <li key={e.id}>
                <span className="text-zinc-500">{e.recordedAt.slice(0, 10)}</span>
                {" · "}
                {e.pattern}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
