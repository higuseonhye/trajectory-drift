import { DeviationRule } from "./deviation";
import { HallucinationRule } from "./hallucination";
import { MissingStepsRule } from "./missing-steps";
import type { DriftRule } from "./types";

export type { DriftRule, RuleContext } from "./types";
export { MissingStepsRule } from "./missing-steps";
export { HallucinationRule } from "./hallucination";
export { DeviationRule } from "./deviation";

export function createDefaultRules(): DriftRule[] {
  return [
    new MissingStepsRule(),
    new HallucinationRule(),
    new DeviationRule(),
  ];
}
