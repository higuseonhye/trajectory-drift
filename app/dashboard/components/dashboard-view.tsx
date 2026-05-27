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
  DEMOS,
  type DemoMode,
  fetchAndIngest,
  runIngestionPipeline,
} from "@/ingestion";
import type {
  CoordinationResult,
  HumanAiCoherenceResult,
  HumanTrajectoryResult,
  OrgMemoryResult,
} from "@/core";
import {
  loadCalibrationMemory,
  saveCalibrationMemory,
} from "../lib/calibration-memory-store";
import { loadOrgMemory, saveOrgMemory } from "../lib/org-memory-store";
import { collectDriftStepIds } from "../lib/drift-steps";
import { CalibrationJournal } from "./calibration-journal";
import { CalibrationPanel } from "./calibration-panel";
import { CoherencePanel } from "./coherence-panel";
import { DashboardShell } from "./dashboard-shell";
import { JsonUpload } from "./json-upload";
import { CoordinationPanel } from "./coordination-panel";
import { DemoSwitcher } from "./demo-switcher";
import { HumanAiPanel } from "./human-ai-panel";
import { EnvironmentalDriftPanel } from "./environmental-drift-panel";
import { HumanTrajectoryPanel } from "./human-trajectory-panel";
import { InteractionIntelligencePanel } from "./interaction-intelligence-panel";
import { MultiLaneGraph } from "./multi-lane-graph";
import { OrgMemoryPanel } from "./org-memory-panel";
import { PropagationDiffPanel } from "./propagation-diff-panel";
import { ScenarioBanner } from "./scenario-banner";
import { TimelineReplay } from "./timeline-replay";
import { TrajectoryGraphView } from "./trajectory-graph";

const embedder = new HashEmbeddingProvider();
const engine = new DriftEngine({ embeddingProvider: embedder });

export function DashboardView() {
  const [result, setResult] = useState<DriftAnalysisResult | null>(null);
  const [calibration, setCalibration] = useState<CalibrationResult | null>(null);
  const [coordination, setCoordination] = useState<CoordinationResult | null>(
    null,
  );
  const [humanAi, setHumanAi] = useState<HumanAiCoherenceResult | null>(null);
  const [orgMemory, setOrgMemory] = useState<OrgMemoryResult | null>(null);
  const [humanTrajectory, setHumanTrajectory] =
    useState<HumanTrajectoryResult | null>(null);
  const [actual, setActual] = useState<Trajectory | null>(null);
  const [demoMode, setDemoMode] = useState<DemoMode>("unified");
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
      setCoordination(data.coordination ?? null);
      setHumanAi(data.humanAi ?? null);
      setOrgMemory(data.orgMemory ?? null);
      setHumanTrajectory(data.humanTrajectory ?? null);
      saveCalibrationMemory(data.calibration.memory);
      if (data.orgMemoryStore) saveOrgMemory(data.orgMemoryStore);
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
        const data = await runIngestionPipeline(raw, engine, {
          priorMemory: loadCalibrationMemory(),
          orgMemoryStore: loadOrgMemory(),
        });
        applyResult(data);
      } catch (err) {
        setResult(null);
        setCalibration(null);
        setCoordination(null);
        setHumanAi(null);
        setOrgMemory(null);
        setHumanTrajectory(null);
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
      const demo = DEMOS[demoMode];
      setFileName(demo.name);
      try {
        const data = await fetchAndIngest(demo.url, engine, {
          priorMemory: loadCalibrationMemory(),
          orgMemoryStore: loadOrgMemory(),
        });
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
  }, [applyResult, demoMode]);

  const loadDemo = useCallback(
    async (mode: DemoMode) => {
      setDemoMode(mode);
      setLoading(true);
      setError(null);
      const demo = DEMOS[mode];
      setFileName(demo.name);
      try {
        const data = await fetchAndIngest(demo.url, engine, {
          priorMemory: loadCalibrationMemory(),
          orgMemoryStore: loadOrgMemory(),
        });
        applyResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load demo");
      } finally {
        setLoading(false);
      }
    },
    [applyResult],
  );

  const displayScenario =
    coordination?.scenario ??
    (demoMode === "unified"
      ? "Unified run · human trajectory + agent coordination"
      : demoMode === "coordination"
        ? "Multi-agent coordination"
        : "Support agent · grounding under uncertainty");

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
          <a
            href="https://github.com/higuseonhye/return"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            Return
          </a>
          <DemoSwitcher
            mode={demoMode}
            onChange={loadDemo}
            disabled={loading}
          />
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
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 overflow-y-auto px-6 py-10 md:py-14">
          {ready && calibration && (
            <ScenarioBanner
              calibration={calibration}
              scenarioTitle={displayScenario}
              coordinationSummary={coordination?.summary}
            />
          )}

          {humanTrajectory && (
            <HumanTrajectoryPanel humanTrajectory={humanTrajectory} />
          )}

          {humanTrajectory && (
            <EnvironmentalDriftPanel humanTrajectory={humanTrajectory} />
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {humanTrajectory && (
              <InteractionIntelligencePanel
                humanTrajectory={humanTrajectory}
              />
            )}
            {coordination && (
              <CoordinationPanel coordination={coordination} loading={loading} />
            )}
            {humanAi && <HumanAiPanel humanAi={humanAi} />}
            {orgMemory && <OrgMemoryPanel orgMemory={orgMemory} />}
          </div>

          {coordination && coordination.propagationDiffs.length > 0 && (
            <PropagationDiffPanel diffs={coordination.propagationDiffs} />
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <section className="panel min-h-[400px] p-4">
              <p className="label-caps mb-4 px-1">
                {coordination?.lanes.some((l) => l.steps.length > 0)
                  ? "Multi-agent lanes"
                  : "Trajectory"}
              </p>
              {loading ? (
                <p className="flex min-h-[360px] items-center justify-center prose-calm">
                  Observing…
                </p>
              ) : coordination?.lanes.some((l) => l.steps.length > 0) ? (
                <MultiLaneGraph
                  lanes={coordination.lanes}
                  handoffs={coordination.handoffs}
                  activeStepId={activeStepId}
                  onStepSelect={handleStepSelect}
                />
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
