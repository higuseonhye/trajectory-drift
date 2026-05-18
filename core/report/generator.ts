import type {
  DriftAnalysisResult,
  DriftIssue,
  DriftIssueKind,
  DriftSeverity,
  TrajectoryGraph,
} from "../types";
import type { DriftReport, DriftReportEntry } from "./types";

const SEVERITY_WEIGHT: Record<DriftSeverity, number> = {
  low: 0.35,
  medium: 0.65,
  high: 1,
};

function stepIndex(graph: TrajectoryGraph, stepId: string): number {
  const node = graph.nodes.find((n) => n.id === stepId);
  return node ? node.index + 1 : -1;
}

function formatLocation(
  graph: TrajectoryGraph,
  stepId: string,
  label: string,
  kind: string,
  side: "reference" | "actual",
): string {
  const index = stepIndex(graph, stepId);
  const position = index > 0 ? `Step ${index}` : "Unknown step";
  return `${position} · ${kind} · ${label} (${side})`;
}

function computeSeverityScore(issue: DriftIssue): number {
  return Math.round(100 * issue.score * SEVERITY_WEIGHT[issue.severity]);
}

interface CauseFix {
  likelyCause: string;
  suggestedFix: string;
}

function resolveCauseAndFix(
  issue: DriftIssue,
  result: DriftAnalysisResult,
): CauseFix {
  const refGraph = result.graphs.reference;
  const actGraph = result.graphs.actual;

  const refNode = issue.referenceStepId
    ? refGraph.nodes.find((n) => n.id === issue.referenceStepId)
    : undefined;
  const actNode = issue.actualStepId
    ? actGraph.nodes.find((n) => n.id === issue.actualStepId)
    : undefined;

  const templates: Record<DriftIssueKind, () => CauseFix> = {
    missing_step: () => ({
      likelyCause:
        refNode?.step.kind === "tool_call"
          ? "A required tool invocation was skipped—often caused by early termination, guardrail blocks, or the agent choosing an alternate path."
          : "An expected step from the reference trajectory never ran—often caused by planning errors, timeouts, or incomplete execution.",
      suggestedFix:
        refNode?.step.kind === "tool_call"
          ? `Enforce tool execution for "${refNode.step.label}" before proceeding; add a retry policy or explicit planner constraint.`
          : `Add a checkpoint that verifies "${refNode?.step.label ?? "the expected step"}" completes; tighten the system prompt to require the full reference sequence.`,
    }),

    hallucination: () => {
      const isTool = actNode?.step.kind === "tool_call";
      const isObservation = actNode?.step.kind === "observation";
      return {
        likelyCause: isTool
          ? "The agent invoked a tool or action not grounded in the reference plan—possible policy bypass or unconstrained tool access."
          : isObservation
            ? "An observation was recorded without support from prior context—often fabricated retrieval results or unvalidated tool output."
            : "Content was generated that is weakly anchored to the reference trajectory—possible confabulation or context overflow.",
        suggestedFix: isTool
          ? `Restrict the tool allowlist; require approval before "${actNode?.step.label ?? "this tool"}" runs; validate inputs against the reference plan.`
          : isObservation
            ? "Cross-check observations against source documents; reject outputs below a grounding threshold before they enter context."
            : "Enable retrieval grounding and citation checks; reduce temperature for planning steps; trim context to verified facts only.",
      };
    },

    deviation: () => {
      const kindMismatch =
        refNode && actNode && refNode.step.kind !== actNode.step.kind;
      const pair = result.alignment.find(
        (p) =>
          p.reference?.id === issue.referenceStepId &&
          p.actual?.id === issue.actualStepId,
      );
      const similarity = pair?.similarity ?? 0;

      if (kindMismatch) {
        return {
          likelyCause: `The agent used the wrong step type (expected ${refNode!.step.kind}, got ${actNode!.step.kind})—often a planner or routing error.`,
          suggestedFix: `Constrain step ${actNode ? stepIndex(actGraph, actNode.id) : "?"} to ${refNode!.step.kind} actions; add schema validation on step outputs before advancing.`,
        };
      }

      if (similarity < 0.4) {
        return {
          likelyCause:
            "Strong semantic drift from the reference step—content or action diverged substantially despite alignment.",
          suggestedFix: `Align prompts and few-shot examples with the reference "${refNode?.step.label ?? "step"}"; use output validators or a critic pass before continuing.`,
        };
      }

      return {
        likelyCause:
          "Moderate semantic drift—wording or parameters differ from the golden trajectory while structure remains similar.",
        suggestedFix:
          `Tighten parameter schemas for "${actNode?.step.label ?? "this step"}"; compare outputs against reference embeddings in CI.`,
      };
    },
  };

  return templates[issue.kind]();
}

function buildLocation(issue: DriftIssue, result: DriftAnalysisResult): string {
  const { reference: refGraph, actual: actGraph } = result.graphs;

  if (issue.kind === "missing_step" && issue.referenceStepId) {
    const node = refGraph.nodes.find((n) => n.id === issue.referenceStepId);
    if (node) {
      return `Missing · ${formatLocation(refGraph, node.id, node.step.label, node.step.kind, "reference")}`;
    }
    return "Missing · unknown reference step";
  }

  if (issue.kind === "hallucination" && issue.actualStepId) {
    const node = actGraph.nodes.find((n) => n.id === issue.actualStepId);
    if (node) {
      return `Extra · ${formatLocation(actGraph, node.id, node.step.label, node.step.kind, "actual")}`;
    }
    return "Extra · unknown actual step";
  }

  if (issue.kind === "deviation") {
    const refNode = issue.referenceStepId
      ? refGraph.nodes.find((n) => n.id === issue.referenceStepId)
      : undefined;
    const actNode = issue.actualStepId
      ? actGraph.nodes.find((n) => n.id === issue.actualStepId)
      : undefined;
    if (refNode && actNode) {
      const refPos = stepIndex(refGraph, refNode.id);
      const actPos = stepIndex(actGraph, actNode.id);
      return `Deviation · actual Step ${actPos} vs reference Step ${refPos} · ${actNode.step.label}`;
    }
  }

  if (issue.actualStepId) {
    const node = actGraph.nodes.find((n) => n.id === issue.actualStepId);
    if (node) {
      return formatLocation(actGraph, node.id, node.step.label, node.step.kind, "actual");
    }
  }

  return "Trajectory (unspecified step)";
}

function issueToEntry(issue: DriftIssue, index: number, result: DriftAnalysisResult): DriftReportEntry {
  const { likelyCause, suggestedFix } = resolveCauseAndFix(issue, result);
  return {
    id: `finding-${index + 1}`,
    kind: issue.kind,
    driftLocation: buildLocation(issue, result),
    severityScore: computeSeverityScore(issue),
    severity: issue.severity,
    likelyCause,
    suggestedFix,
    referenceStepId: issue.referenceStepId,
    actualStepId: issue.actualStepId,
  };
}

export function generateDriftReport(result: DriftAnalysisResult): DriftReport {
  const entries = result.issues.map((issue, i) => issueToEntry(issue, i, result));

  entries.sort((a, b) => b.severityScore - a.severityScore);

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFindings: entries.length,
      overallDriftPercent: Math.round(result.scores.driftScore * 100),
      highSeverityCount: entries.filter((e) => e.severity === "high").length,
      referenceTrajectoryId: result.referenceTrajectoryId,
      actualTrajectoryId: result.actualTrajectoryId,
    },
    entries,
  };
}
