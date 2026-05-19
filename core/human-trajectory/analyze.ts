import { buildInteractionGraph, type InteractionGraph } from "./interaction-graph";
import { detectInterventions, type InterventionSignal } from "./intervention";
import { computeMomentumMetrics, type MomentumMetrics } from "./momentum-engine";
import type { TrajectoryEvent } from "./types";

export interface HumanTrajectoryResult {
  eventCount: number;
  metrics: MomentumMetrics;
  interventions: InterventionSignal[];
  interactionGraph: InteractionGraph;
  observation: string;
  summary: string;
}

export function runHumanTrajectoryAnalysis(
  events: TrajectoryEvent[],
): HumanTrajectoryResult {
  const metrics = computeMomentumMetrics(events);
  const interventions = detectInterventions(events, metrics);
  const interactionGraph = buildInteractionGraph(events);

  const observation =
    interventions[0]?.interpretation ??
    metrics.summary;

  const flags: string[] = [];
  if (metrics.interactionStarvation) flags.push("interaction starvation");
  if (metrics.momentumDegrading) flags.push("momentum degrading");
  const summary =
    flags.length > 0
      ? `${events.length} events · ${flags.join(" · ")}`
      : `${events.length} events · human trajectory stable`;

  return {
    eventCount: events.length,
    metrics,
    interventions,
    interactionGraph,
    observation,
    summary,
  };
}
