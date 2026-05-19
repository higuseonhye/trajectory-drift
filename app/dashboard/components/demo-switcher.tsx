"use client";

import type { DemoMode } from "@/ingestion/demo";
import { DEMOS } from "@/ingestion/demo";

interface DemoSwitcherProps {
  mode: DemoMode;
  onChange: (mode: DemoMode) => void;
  disabled?: boolean;
}

export function DemoSwitcher({ mode, onChange, disabled }: DemoSwitcherProps) {
  return (
    <div className="flex gap-1 rounded-md border border-[var(--border-subtle)] p-0.5">
      {(Object.keys(DEMOS) as DemoMode[]).map((key) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onChange(key)}
          className={`rounded px-2.5 py-1 text-xs transition ${
            mode === key
              ? "bg-zinc-800 text-zinc-200"
              : "text-zinc-600 hover:text-zinc-400"
          } disabled:opacity-50`}
        >
          {key === "single"
            ? "Single"
            : key === "coordination"
              ? "Multi-agent"
              : "Unified"}
        </button>
      ))}
    </div>
  );
}
