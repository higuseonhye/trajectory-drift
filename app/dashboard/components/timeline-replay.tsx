"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { AgentStep, DriftIssue } from "@/core";
import { issuesForStep } from "../lib/drift-steps";

const KIND_STYLES: Record<string, string> = {
  thought: "border-l-indigo-500",
  tool_call: "border-l-amber-500",
  observation: "border-l-emerald-500",
  response: "border-l-blue-500",
  decision: "border-l-purple-500",
};

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

  if (steps.length === 0) {
    return (
      <div className="panel border-dashed p-8 text-center text-sm text-zinc-600">
        Timeline loads with agent execution data.
      </div>
    );
  }

  const activeStep = steps[activeIndex];

  return (
    <div className="panel p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Execution timeline
          </h2>
          <p className="text-xs text-zinc-600">
            Step {activeIndex + 1} of {steps.length}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
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
            const isPlay = label === "Play";
            return (
              <button
                key={label}
                type="button"
                disabled={disabled}
                onClick={handlers[i]}
                className={
                  isPlay
                    ? "rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
                    : "rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-30"
                }
              >
                {isPlay ? (playing ? "Pause" : "Play") : label}
              </button>
            );
          })}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={maxIndex}
        value={activeIndex}
        onChange={(e) => {
          setPlaying(false);
          seek(Number(e.target.value));
        }}
        className="mb-4 w-full accent-blue-500"
      />

      {activeStep && (
        <div
          className={`mb-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 ${
            driftStepIds.has(activeStep.id) ? "ring-1 ring-red-500/50" : ""
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-zinc-200">{activeStep.label}</span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
              {activeStep.kind}
            </span>
            {driftStepIds.has(activeStep.id) && (
              <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-400">
                Drift
              </span>
            )}
          </div>
          <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-500">
            {activeStep.content}
          </p>
          {issuesForStep(issues, activeStep.id).map((issue, i) => (
            <p key={i} className="mt-2 text-xs text-red-400/90">
              {issue.message}
            </p>
          ))}
        </div>
      )}

      <ol className="flex gap-1 overflow-x-auto pb-1">
        {steps.map((step, i) => {
          const isDrift = driftStepIds.has(step.id);
          const isActive = i === activeIndex;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => { setPlaying(false); seek(i); }}
                className={`flex h-12 w-9 shrink-0 items-center justify-center rounded border text-[10px] font-medium ${
                  isActive
                    ? "border-blue-500 bg-blue-600 text-white"
                    : isDrift
                      ? "border-red-500/50 bg-red-500/10 text-red-400"
                      : `border-[var(--border)] bg-[var(--surface)] text-zinc-500 ${KIND_STYLES[step.kind] ?? ""} border-l-2`
                }`}
                title={step.label}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
