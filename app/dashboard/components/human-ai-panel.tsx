"use client";

import type { HumanAiCoherenceResult } from "@/core";

const LEVEL_META: Record<
  HumanAiCoherenceResult["level"],
  { label: string; description: string }
> = {
  stable: {
    label: "Human–AI coherence stable",
    description: "Interaction rhythm and context alignment hold.",
  },
  strained: {
    label: "Coordination strained",
    description: "Overrides or async gaps may be weakening shared context.",
  },
  fatigued: {
    label: "Coordination fatigue",
    description: "Cognitive load or contamination risk in the collaboration loop.",
  },
};

interface HumanAiPanelProps {
  humanAi: HumanAiCoherenceResult;
}

export function HumanAiPanel({ humanAi }: HumanAiPanelProps) {
  const meta = LEVEL_META[humanAi.level];

  return (
    <section className="panel p-6">
      <p className="label-caps">Human–AI coherence</p>
      <p className="mt-3 text-lg font-medium tracking-tight text-zinc-200">
        {meta.label}
      </p>
      <p className="mt-2 prose-calm">{meta.description}</p>
      <p className="mt-4 border-l border-zinc-700 pl-3 text-sm italic text-zinc-500">
        {humanAi.observation}
      </p>
      <div className="mt-6 flex gap-8">
        <div>
          <p className="label-caps">Score</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {humanAi.coherenceScore}
          </p>
        </div>
        <div>
          <p className="label-caps">Interactions</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {humanAi.interactionCount}
          </p>
        </div>
      </div>
      {humanAi.signals.length > 0 && (
        <ul className="mt-6 space-y-3">
          {humanAi.signals.map((s) => (
            <li key={s.interpretation} className="border-l border-zinc-700 pl-3">
              <p className="prose-calm">{s.interpretation}</p>
              {s.suggestedCalibration && (
                <p className="mt-1 text-xs text-zinc-600">
                  {s.suggestedCalibration}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
