import type { DriftAnalysisResult, DriftIssue, DriftIssueKind } from "../types";
import type { CalibrationAction, CalibrationInsight } from "./types";

function actionsForKind(
  kind: DriftIssueKind,
  issue: DriftIssue,
): CalibrationAction[] {
  const templates: Record<DriftIssueKind, CalibrationAction[]> = {
    missing_step: [
      {
        label: "Increase retrieval priority",
        rationale:
          "Elevate grounding actions earlier in the planning phase so they are not bypassed under conversational momentum.",
      },
      {
        label: "Insert grounding checkpoint",
        rationale:
          "Require an explicit verification step before generation when retrieval has not yet executed.",
      },
      {
        label: "Reduce memory carry-over weight",
        rationale:
          "Limit how much prior conversational context influences the next action without fresh grounding.",
      },
    ],
    hallucination: [
      {
        label: "Tighten grounding threshold",
        rationale:
          "Reject observations that lack corroboration from approved retrieval sources before they enter context.",
      },
      {
        label: "Constrain tool routing",
        rationale:
          "Route lookup behavior through canonical retrieval paths rather than open-ended alternatives.",
      },
    ],
    deviation: [
      {
        label: "Recalibrate step-type routing",
        rationale:
          "Align planner outputs with the reference step sequence to preserve behavioral continuity.",
      },
      {
        label: "Strengthen reference alignment",
        rationale:
          "Compare generation outputs against the golden trajectory embedding before advancing.",
      },
    ],
  };
  return templates[kind];
}

function interpretIssue(issue: DriftIssue, index: number): CalibrationInsight {
  const stepIds = [issue.actualStepId, issue.referenceStepId].filter(
    (id): id is string => Boolean(id),
  );

  const interpretations: Record<DriftIssueKind, { text: string; factors: string[] }> = {
    missing_step: {
      text:
        "The trajectory appears to under-weight grounding actions while allowing conversational momentum to advance the run. A required calibration point in the reference model was not exercised.",
      factors: [
        "Grounding action deprioritized relative to dialogue flow",
        "Behavioral continuity broken at a reference anchor step",
      ],
    },
    hallucination: {
      text:
        "The system may be over-weighting conversational carry-over or alternate lookup paths while under-weighting retrieval grounding. Generated or observed content lacks stable anchoring in the reference model.",
      factors: [
        "Weak grounding relative to reference retrieval",
        "Context synthesis ahead of verified sources",
      ],
    },
    deviation: {
      text:
        "Behavioral calibration has shifted — the live trajectory follows a different reasoning or action pattern than the reference, reducing continuity under the current context.",
      factors: [
        "Semantic or structural misalignment with reference step",
        "Adaptive path diverged from stabilized behavioral model",
      ],
    },
  };

  const { text, factors } = interpretations[issue.kind];

  return {
    id: `cal-${index + 1}`,
    relatedIssueKind: issue.kind,
    stepIds,
    interpretation: text,
    instabilityFactors: factors,
    suggestedCalibration: actionsForKind(issue.kind, issue),
  };
}

export function buildCalibrationInsights(
  analysis: DriftAnalysisResult,
): CalibrationInsight[] {
  return analysis.issues.map((issue, i) => interpretIssue(issue, i));
}

export function buildGlobalSummary(
  analysis: DriftAnalysisResult,
  insightCount: number,
  weakSignalCount: number,
  memoryNote: string | null,
): string {
  const driftPct = Math.round(analysis.scores.driftScore * 100);
  const base = `Continuity assessment: ${driftPct}% deviation from the reference behavioral model across ${analysis.alignment.length} aligned steps. ${insightCount} calibration point(s) and ${weakSignalCount} weak signal(s) inform recalibration.`;

  if (memoryNote) {
    return `${base} ${memoryNote}`;
  }
  return base;
}
