import type { AgentStep } from "./trajectory";

export type GraphEdgeKind = "sequential" | "dependency";

export interface TrajectoryGraphNode {
  id: string;
  step: AgentStep;
  /** Zero-based position in the source trajectory. */
  index: number;
}

export interface TrajectoryGraphEdge {
  from: string;
  to: string;
  kind: GraphEdgeKind;
}

/** Directed graph representation of a trajectory. */
export interface TrajectoryGraph {
  trajectoryId: string;
  nodes: TrajectoryGraphNode[];
  edges: TrajectoryGraphEdge[];
}
