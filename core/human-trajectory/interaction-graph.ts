import type { TrajectoryEvent } from "./types";

export type InteractionRole = "amplifier" | "neutral" | "drain";

export interface InteractionNode {
  id: string;
  label: string;
  momentumNet: number;
  eventCount: number;
  role: InteractionRole;
}

export interface InteractionInsight {
  subject: string;
  interpretation: string;
  suggestedCalibration?: string;
}

export interface InteractionGraph {
  nodes: InteractionNode[];
  insights: InteractionInsight[];
  observation: string;
}

function slug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "-").slice(0, 48);
}

function resolveRole(net: number): InteractionRole {
  if (net >= 2) return "amplifier";
  if (net <= -2) return "drain";
  return "neutral";
}

/** Who/what increases or drains momentum — interaction-mediated trajectory. */
export function buildInteractionGraph(
  events: TrajectoryEvent[],
): InteractionGraph {
  const bySubject = new Map<string, { net: number; count: number }>();

  for (const e of events) {
    const key = e.subject?.trim() || "_ambient_";
    const cur = bySubject.get(key) ?? { net: 0, count: 0 };
    cur.net += e.momentumDelta ?? 0;
    cur.count += 1;
    bySubject.set(key, cur);
  }

  const nodes: InteractionNode[] = [...bySubject.entries()]
    .filter(([k]) => k !== "_ambient_")
    .map(([label, { net, count }]) => ({
      id: slug(label),
      label,
      momentumNet: net,
      eventCount: count,
      role: resolveRole(net),
    }))
    .sort((a, b) => b.momentumNet - a.momentumNet);

  const insights: InteractionInsight[] = nodes
    .filter((n) => n.role !== "neutral")
    .map((n) => ({
      subject: n.label,
      interpretation:
        n.role === "amplifier"
          ? `${n.label} correlates with momentum gain (${n.eventCount} events).`
          : `${n.label} correlates with entropy or stalled loops.`,
      suggestedCalibration:
        n.role === "drain"
          ? "Reduce passive exposure or renegotiate interaction contract"
          : "Prioritize more time in this environment",
    }));

  const drains = nodes.filter((n) => n.role === "drain").length;
  const amps = nodes.filter((n) => n.role === "amplifier").length;

  let observation = "Interaction landscape balanced.";
  if (drains > amps && drains >= 1) {
    observation =
      "More momentum drains than amplifiers — social reinforcement may be misaligned.";
  } else if (amps >= 2) {
    observation = "Strong amplifiers present — protect time in those environments.";
  }

  return { nodes, insights, observation };
}
