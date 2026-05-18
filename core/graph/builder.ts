import type {
  Trajectory,
  TrajectoryGraph,
  TrajectoryGraphEdge,
  TrajectoryGraphNode,
} from "../types";

/**
 * Builds a directed graph from a trajectory.
 * - Sequential edges connect consecutive steps.
 * - Dependency edges connect steps listed in `dependsOn`.
 */
export function buildTrajectoryGraph(trajectory: Trajectory): TrajectoryGraph {
  const nodes: TrajectoryGraphNode[] = trajectory.steps.map((step, index) => ({
    id: step.id,
    step,
    index,
  }));

  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges: TrajectoryGraphEdge[] = [];

  for (let i = 0; i < trajectory.steps.length - 1; i++) {
    edges.push({
      from: trajectory.steps[i].id,
      to: trajectory.steps[i + 1].id,
      kind: "sequential",
    });
  }

  for (const step of trajectory.steps) {
    for (const depId of step.dependsOn ?? []) {
      if (!nodeIds.has(depId)) continue;
      edges.push({
        from: depId,
        to: step.id,
        kind: "dependency",
      });
    }
  }

  return {
    trajectoryId: trajectory.id,
    nodes,
    edges,
  };
}
