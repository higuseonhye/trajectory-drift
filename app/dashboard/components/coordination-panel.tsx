"use client";

import type { CoordinationResult } from "@/core";

const COHERENCE_LABELS: Record<
  CoordinationResult["delegationCoherence"],
  { label: string; description: string }
> = {
  aligned: {
    label: "Delegation coherent",
    description: "Handoffs preserved context across agents.",
  },
  weakening: {
    label: "Coordination weakening",
    description: "Context is degrading across the delegation chain.",
  },
  incoherent: {
    label: "Delegation incoherent",
    description: "Agents may agree while grounding diverges.",
  },
};

interface CoordinationPanelProps {
  coordination: CoordinationResult | null | undefined;
  loading?: boolean;
}

export function CoordinationPanel({
  coordination,
  loading,
}: CoordinationPanelProps) {
  if (loading) {
    return (
      <div className="panel p-6">
        <p className="prose-calm">Observing coordination…</p>
      </div>
    );
  }

  if (!coordination) return null;

  const meta = COHERENCE_LABELS[coordination.delegationCoherence];

  return (
    <section className="panel p-6">
      <p className="label-caps">Coordination</p>
      <p className="mt-3 text-lg font-medium tracking-tight text-zinc-200">
        {meta.label}
      </p>
      <p className="mt-2 prose-calm">{meta.description}</p>
      <p className="mt-4 border-l border-zinc-700 pl-3 text-sm italic text-zinc-500">
        {coordination.observation}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="label-caps">Integrity</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {coordination.coordinationIntegrity}
          </p>
        </div>
        <div>
          <p className="label-caps">Agents</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {coordination.agentCount}
          </p>
        </div>
        <div>
          <p className="label-caps">Handoffs</p>
          <p className="mt-2 text-2xl font-light tabular-nums text-zinc-300">
            {coordination.handoffCount}
          </p>
        </div>
      </div>

      {coordination.signals.length > 0 && (
        <div className="mt-6">
          <p className="label-caps mb-3">Delegation continuity</p>
          <ul className="space-y-3">
            {coordination.signals.map((signal) => (
              <li
                key={`${signal.kind}-${signal.handoffId ?? signal.interpretation}`}
                className="border-l border-zinc-700 pl-3"
              >
                <p className="prose-calm">{signal.interpretation}</p>
                {signal.suggestedCalibration && (
                  <p className="mt-1 text-xs text-zinc-600">
                    {signal.suggestedCalibration}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
