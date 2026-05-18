import type { DriftIssueKind, DriftSeverity } from "../types";

export interface DriftReportEntry {
  id: string;
  kind: DriftIssueKind;
  /** Human-readable drift location (step index, label, trajectory side). */
  driftLocation: string;
  /** Normalized severity in [0, 100]. */
  severityScore: number;
  severity: DriftSeverity;
  likelyCause: string;
  suggestedFix: string;
  referenceStepId?: string;
  actualStepId?: string;
}

export interface DriftReportSummary {
  totalFindings: number;
  overallDriftPercent: number;
  highSeverityCount: number;
  referenceTrajectoryId: string;
  actualTrajectoryId: string;
}

export interface DriftReport {
  generatedAt: string;
  summary: DriftReportSummary;
  entries: DriftReportEntry[];
}
