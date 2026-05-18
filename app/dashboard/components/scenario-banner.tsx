"use client";

interface ScenarioBannerProps {
  scenario?: string;
  referenceId?: string;
  actualId?: string;
  findingsCount?: number;
}

export function ScenarioBanner({
  referenceId,
  actualId,
  findingsCount,
}: ScenarioBannerProps) {
  return (
    <div className="panel border-blue-500/20 bg-blue-500/5 px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
            Active scenario
          </p>
          <h2 className="mt-0.5 text-sm font-semibold text-zinc-100">
            Support agent — refund policy Q&A
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-400">
            Golden run uses internal KB retrieval + policy validation. Live run
            skips retrieval, cites unverified web sources, and returns an
            incorrect refund policy.
          </p>
        </div>
        {findingsCount !== undefined && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center">
            <p className="text-lg font-semibold tabular-nums text-red-400">
              {findingsCount}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">
              findings
            </p>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          "Missing retrieve_knowledge",
          "Hallucinated observation",
          "Response deviation",
        ].map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[10px] text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
      {(referenceId || actualId) && (
        <p className="mt-2 font-mono text-[10px] text-zinc-600">
          {referenceId && `ref: ${referenceId}`}
          {referenceId && actualId && " · "}
          {actualId && `actual: ${actualId}`}
        </p>
      )}
    </div>
  );
}
