"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DriftEngine,
  getCoherenceIndicator,
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
import { CalibrationJournal } from "./calibration-journal";
import { CalibrationPanel } from "./calibration-panel";
import { CoherencePanel } from "./coherence-panel";
import { DashboardShell } from "./dashboard-shell";
import { JsonUpload } from "./json-upload";
import { ScenarioBanner } from "./scenario-banner";
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
  const coherenceLabel = calibration
    ? getCoherenceIndicator(calibration.stabilityLevel).label
    : null;
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
        const data = await runIngestionPipeline(
          raw,
          engine,
          loadCalibrationMemory(),
        );
        applyResult(data);
      } catch (err) {
        setResult(null);
        setCalibration(null);
        setActual(null);
        setError(err instanceof Error ? err.message : "Could not read this run");
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
      setFileName(DEMO_LOG_NAME);
      try {
        const data = await fetchAndIngest(
          DEMO_LOG_URL,
          engine,
          loadCalibrationMemory(),
        );
        if (!cancelled) applyResult(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load demo");
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
      const index = actual?.steps.findIndex((s) => s.id === stepId) ?? -1;
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

  const status =
    ready && coherenceLabel ? (
      <span className="text-xs text-zinc-600">{coherenceLabel}</span>
    ) : loading ? (
      <span className="text-xs text-zinc-600">Observing…</span>
    ) : null;

  return (
    <DashboardShell
      status={status}
      actions={
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-zinc-600 transition hover:text-zinc-400"
          >
            Home
          </Link>
          <JsonUpload onLoad={processLogs} disabled={loading} />
        </div>
      }
    >
      {error && (
        <p className="border-b border-[var(--border-subtle)] px-6 py-3 text-center text-sm text-zinc-500">
          {error}
        </p>
      )}

      <div className="flex flex-1 overflow-hidden">
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 overflow-y-auto px-6 py-8">
          {ready && calibration && <ScenarioBanner calibration={calibration} />}

          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <section className="panel min-h-[400px] p-4">
              <p className="label-caps mb-4 px-1">Trajectory</p>
              {loading ? (
                <p className="flex min-h-[360px] items-center justify-center prose-calm">
                  Observing…
                </p>
              ) : graph ? (
                <TrajectoryGraphView
                  graph={graph}
                  driftStepIds={driftStepIds}
                  stabilityLevel={stabilityLevel}
                  activeStepId={activeStepId}
                  onStepSelect={handleStepSelect}
                />
              ) : (
                <p className="flex min-h-[360px] items-center justify-center prose-calm">
                  No trajectory yet.
                </p>
              )}
            </section>

            <CoherencePanel calibration={calibration} loading={loading} />
          </div>

          {ready && calibration && (
            <CalibrationJournal calibration={calibration} />
          )}

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
