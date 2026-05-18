"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DriftEngine,
  HashEmbeddingProvider,
  type CalibrationInsight,
  type CalibrationResult,
  type DriftAnalysisResult,
  type Trajectory,
} from "@/core";
import {
  DEMO_LOG_NAME,
  DEMO_LOG_URL,
  fetchAndIngest,
  runIngestionPipeline,
} from "@/ingestion";
import {
  loadCalibrationMemory,
  saveCalibrationMemory,
} from "../lib/calibration-memory-store";
import { collectDriftStepIds } from "../lib/drift-steps";
import { CalibrationPanel } from "./calibration-panel";
import { DashboardShell } from "./dashboard-shell";
import { JsonUpload } from "./json-upload";
import { ScenarioBanner } from "./scenario-banner";
import { StabilityPanel } from "./stability-panel";
import { TimelineReplay } from "./timeline-replay";
import { TrajectoryGraphView } from "./trajectory-graph";

const embedder = new HashEmbeddingProvider();
const engine = new DriftEngine({ embeddingProvider: embedder });

export function DashboardView() {
  const [result, setResult] = useState<DriftAnalysisResult | null>(null);
  const [calibration, setCalibration] = useState<CalibrationResult | null>(null);
  const [actual, setActual] = useState<Trajectory | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
  const bootstrapped = useRef(false);

  const driftStepIds = useMemo(
    () => (result ? collectDriftStepIds(result) : new Set<string>()),
    [result],
  );

  const stabilityLevel = calibration?.stabilityLevel ?? "stable";
  const activeStepId = actual?.steps[activeIndex]?.id ?? null;
  const ready = !loading && result !== null && calibration !== null;

  const applyResult = useCallback(
    (data: Awaited<ReturnType<typeof runIngestionPipeline>>) => {
      setActual(data.actual);
      setResult(data.analysis);
      setCalibration(data.calibration);
      saveCalibrationMemory(data.calibration.memory);
      setActiveIndex(0);
      setSelectedInsightId(null);
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
        const priorMemory = loadCalibrationMemory();
        const data = await runIngestionPipeline(raw, engine, priorMemory);
        applyResult(data);
      } catch (err) {
        setResult(null);
        setCalibration(null);
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

    async function bootstrap() {
      setLoading(true);
      setError(null);
      setFileName(DEMO_LOG_NAME);
      try {
        const priorMemory = loadCalibrationMemory();
        const data = await fetchAndIngest(DEMO_LOG_URL, engine, priorMemory);
        if (cancelled) return;
        applyResult(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load demo");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void bootstrap();
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

  const handleInsightSelect = useCallback(
    (insight: CalibrationInsight) => {
      setSelectedInsightId(insight.id);
      const stepId = insight.stepIds[0];
      if (stepId) handleStepSelect(stepId);
    },
    [handleStepSelect],
  );

  const graph = result?.graphs.actual ?? null;

  const status = fileName ? (
    <p className="text-xs text-zinc-500">
      {loading ? (
        <>Calibrating <span className="font-mono text-zinc-400">{fileName}</span>…</>
      ) : ready ? (
        <>
          <span className="font-mono text-zinc-400">{fileName}</span>
          {" · "}
          continuity {calibration?.continuityScore}/100
        </>
      ) : null}
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
        <p className="border-b border-rose-900/30 bg-rose-950/20 px-6 py-2 text-center text-sm text-rose-300/90">
          {error}
        </p>
      )}

      <div className="flex flex-1 overflow-hidden">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 overflow-y-auto p-5">
          {ready && calibration && (
            <ScenarioBanner calibration={calibration} />
          )}

          <div className="grid flex-1 gap-4 lg:grid-cols-3">
            <section className="panel flex flex-col p-3 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Trajectory graph
                </h2>
                <div className="flex gap-3 text-[10px] text-zinc-600">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                    Stable
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                    Unstable
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-400/70" />
                    Elevated risk
                  </span>
                </div>
              </div>
              {loading ? (
                <div className="flex min-h-[380px] flex-1 flex-col items-center justify-center gap-3 text-sm text-zinc-500">
                  <span className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500/80" />
                  Observing trajectory continuity…
                </div>
              ) : graph ? (
                <TrajectoryGraphView
                  graph={graph}
                  driftStepIds={driftStepIds}
                  stabilityLevel={stabilityLevel}
                  activeStepId={activeStepId}
                  onStepSelect={handleStepSelect}
                />
              ) : (
                <div className="flex min-h-[380px] items-center justify-center text-sm text-zinc-500">
                  No trajectory data.
                </div>
              )}
            </section>

            <section className="min-h-[380px] lg:col-span-1">
              <StabilityPanel calibration={calibration} loading={loading} />
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

        <CalibrationPanel
          calibration={calibration}
          loading={loading}
          selectedInsightId={selectedInsightId}
          onSelectInsight={handleInsightSelect}
        />
      </div>
    </DashboardShell>
  );
}
