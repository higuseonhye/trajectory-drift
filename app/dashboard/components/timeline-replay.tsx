"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { AgentStep, DriftIssue } from "@/core";
import { issuesForStep } from "../lib/drift-steps";

interface TimelineReplayProps {
  steps: AgentStep[];
  driftStepIds: Set<string>;
  issues: DriftIssue[];
  activeIndex: number;
  onIndexChange: Dispatch<SetStateAction<number>>;
}

export function TimelineReplay({
  steps,
  driftStepIds,
  issues,
  activeIndex,
  onIndexChange,
}: TimelineReplayProps) {
  const [playing, setPlaying] = useState(false);
  const maxIndex = Math.max(0, steps.length - 1);

  const seek = useCallback(
    (index: number) => onIndexChange(Math.max(0, Math.min(maxIndex, index))),
    [maxIndex, onIndexChange],
  );

  useEffect(() => {
    if (!playing || steps.length === 0) return;
    const timer = window.setInterval(() => {
      onIndexChange((current) => {
        if (current >= maxIndex) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [playing, steps.length, maxIndex, onIndexChange]);

  if (steps.length === 0) return null;

  const activeStep = steps[activeIndex];

  return (
    <section className="panel p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="label-caps">Timeline</p>
        <p className="text-xs text-zinc-600">
          {activeIndex + 1} / {steps.length}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        {(["Reset", "Prev", "Play", "Next"] as const).map((label, i) => {
          const handlers = [
            () => { setPlaying(false); seek(0); },
            () => { setPlaying(false); seek(activeIndex - 1); },
            () => setPlaying((p) => !p),
            () => { setPlaying(false); seek(activeIndex + 1); },
          ];
          const disabled =
            (label === "Prev" && activeIndex <= 0) ||
            (label === "Next" && activeIndex >= maxIndex);
          return (
            <button
              key={label}
              type="button"
              disabled={disabled}
              onClick={handlers[i]}
              className="text-xs text-zinc-500 transition hover:text-zinc-300 disabled:opacity-30"
            >
              {label === "Play" ? (playing ? "Pause" : "Play") : label}
            </button>
          );
        })}
      </div>

      {activeStep && (
        <div className="mt-6 border-l border-zinc-700 pl-4">
          <p className="text-sm text-zinc-300">{activeStep.label}</p>
          <p className="mt-1 text-xs text-zinc-600">{activeStep.kind}</p>
          <p className="mt-3 font-mono text-xs leading-relaxed text-zinc-500">
            {activeStep.content}
          </p>
        </div>
      )}

      <ol className="mt-6 flex gap-1">
        {steps.map((step, i) => (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => { setPlaying(false); seek(i); }}
              className={`h-8 w-7 text-[10px] tabular-nums transition ${
                i === activeIndex
                  ? "text-zinc-200"
                  : driftStepIds.has(step.id)
                    ? "text-zinc-600"
                    : "text-zinc-700 hover:text-zinc-500"
              }`}
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
