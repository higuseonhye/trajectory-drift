import type { DriftEngineConfig } from "../drift/config";
import type { AgentStep, DriftIssue, StepAlignment } from "../types";

export interface RuleContext {
  alignment: StepAlignment[];
  referenceSteps: AgentStep[];
  actualSteps: AgentStep[];
  config: DriftEngineConfig;
}

export interface DriftRule {
  readonly id: string;
  evaluate(context: RuleContext): DriftIssue[];
}
