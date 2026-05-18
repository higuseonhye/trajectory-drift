"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DriftEngine,
  generateDriftReport,
  HashEmbeddingProvider,
  type DriftAnalysisResult,
  type DriftReportEntry,
  type Trajectory,
} from "@/core";
import {
  DEMO_LOG_NAME,
  DEMO_LOG_URL,
  fetchAndIngest,
  runIngestionPipeline,
} from "@/ingestion";
import { collectDriftStepIds } from "../lib/drift-steps";
import { DashboardShell } from "./dashboard-shell";
import { DriftScorePanel } from "./drift-score-panel";
import { JsonUpload } from "./json-upload";
import { ReportSidebar } from "./report-sidebar";
import { ScenarioBanner } from "./scenario-banner";
import { TimelineReplay } from "./timeline-replay";
import { TrajectoryGraphView } from "./trajectory-graph";

const embedder = new HashEmbeddingProvider();
const engine = new DriftEngine({ embeddingProvider: embedder });

function applyIngestionResult(
  data: Awaited<ReturnType<typeof runIngestionPipeline>>,
  setters: {
    setActual: (t: Trajectory) => void;
    setResult: (r: DriftAnalysisResult) => void;
    setActiveIndex: (i: number) => void;
    setSelectedEntryId: (id: string | null) => void;
  },
) {
  setters.setActual(data.actual);
  setters.setResult(data.analysis);
  setters.setActiveIndex(0);
  setters.setSelectedEntryId(null);
}

export function DashboardView() {
  const [result, setResult] = useState<DriftAnalysisResult | null>(null);
  const [actual, setActual] = useState<Trajectory | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const bootstrapped = useRef(false);

  const driftStepIds = useMemo(
    () => (result ? collectDriftStepIds(result) : new Set<string>()),
    [result],
  );

  const report = useMemo(
    () => (result ? generateDriftReport(result) : null),
    [result],
  );

  const activeStepId = actual?.steps[activeIndex]?.id ?? null;

  const applyResult = useCallback(
    (data: Awaited<ReturnType<typeof runIngestionPipeline>>) => {
      applyIngestionResult(data, {
        setActual,
        setResult,
        setActiveIndex,
        setSelectedEntryId,
      });
    },
    [],
  );

  const processLogs = useCallback(
    async (text: string, name: string) => {
      setLoading(true);
      setError(null);
      setFileName(name);

      try {
        const raw = JSON.parse(text) as unknown;
        const data = await runIngestionPipeline(raw, engine);
        applyResult(data);
      } catch (err) {
        setResult(null);
        setActual(null);
        setError(err instanceof Error ? err.message : "Failed to process logs");
      } finally {
        setLoading(false);
      }
    },
    [applyResult],
  );

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    let cancelled = false;

    async function bootstrapDemo() {
      setLoading(true);
      setError(null);
      setFileName(DEMO_LOG_NAME);

      try {
        const data = await fetchAndIngest(DEMO_LOG_URL, engine);
        if (cancelled) return;
        applyResult(data);
      } catch (err) {
        if (cancelled) return;
        setResult(null);
        setActual(null);
        setError(
          err instanceof Error ? err.message : "Failed to load demo dataset",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void bootstrapDemo();
    return () => {
      cancelled = true;
    };
  }, [applyResult]);

  const handleStepSelect = useCallback(
    (stepId: string) => {
      if (!actual) return;
      const index = actual.steps.findIndex((s) => s.id === stepId);
      if (index >= 0) setActiveIndex(index);
    },
    [actual],
  );

  const handleReportEntrySelect = useCallback(
    (entry: DriftReportEntry) => {
      setSelectedEntryId(entry.id);
      const stepId = entry.actualStepId ?? entry.referenceStepId;
      if (stepId) handleStepSelect(stepId);
    },
    [handleStepSelect],
  );

  const graph = result?.graphs.actual ?? null;
  const ready = !loading && result !== null && actual !== null;

  const status = fileName ? (
    <p className="text-xs text-zinc-500">
      {loading ? (
        <>
          Analyzing <span className="font-mono text-zinc-400">{fileName}</span>…
        </>
      ) : (
        <>
          <span className="font-mono text-zinc-400">{fileName}</span>
          {ready && report && (
            <>
              {" "}
              ·{" "}
              <span className="text-red-400">
                {report.summary.totalFindings} findings
              </span>{" "}
              · {report.summary.overallDriftPercent}% drift
            </>
          )}
        </>
      )}
    </p>
  ) : null;

  return (
    <DashboardShell
      status={status}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden text-xs text-zinc-500 transition hover:text-zinc-300 sm:block"
          >
            Home
          </Link>
          <JsonUpload onLoad={processLogs} disabled={loading} />
        </div>
      }
    >
      {error && (
        <p className="border-b border-red-900/50 bg-red-950/30 px-6 py-2 text-center text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-1 overflow-hidden">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 overflow-y-auto p-5">
          {ready && (
            <ScenarioBanner
              scenario={
                (actual?.metadata?.scenario as string | undefined) ??
                "refund_policy_qa"
              }
              referenceId={result?.referenceTrajectoryId}
              actualId={result?.actualTrajectoryId}
              findingsCount={report?.summary.totalFindings}
            />
          )}

          <div className="grid flex-1 gap-4 lg:grid-cols-3">
            <section className="panel flex flex-col p-3 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Trajectory graph
                </h2>
                <div className="flex gap-3 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Drift
                  </span>
                </div>
              </div>
              {loading ? (
                <div className="flex min-h-[380px] flex-1 flex-col items-center justify-center gap-3 text-sm text-zinc-500">
                  <span className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
                  Ingesting logs & computing drift…
                </div>
              ) : graph ? (
                <TrajectoryGraphView
                  graph={graph}
                  driftStepIds={driftStepIds}
                  activeStepId={activeStepId}
                  onStepSelect={handleStepSelect}
                />
              ) : (
                <div className="flex min-h-[380px] items-center justify-center text-sm text-zinc-500">
                  {error ?? "No trajectory data."}
                </div>
              )}
            </section>

            <section className="min-h-[380px] lg:col-span-1">
              <DriftScorePanel result={result} loading={loading} />
            </section>
          </div>

          <TimelineReplay
            steps={actual?.steps ?? []}
            driftStepIds={driftStepIds}
            issues={result?.issues ?? []}
            activeIndex={activeIndex}
            onIndexChange={setActiveIndex}
          />
        </main>

        <ReportSidebar
          report={loading ? null : report}
          loading={loading}
          selectedEntryId={selectedEntryId}
          onSelectEntry={handleReportEntrySelect}
        />
      </div>
    </DashboardShell>
  );
}
