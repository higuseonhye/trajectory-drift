import { parseContextFields } from "./context-fields";
import type { FieldPropagationDiff, HandoffRecord } from "./types";

export function diffHandoffPropagation(
  handoff: HandoffRecord,
): FieldPropagationDiff[] {
  const expected =
    handoff.expectedFields ??
    parseContextFields(handoff.expectedContext);
  const actual =
    handoff.actualFields ?? parseContextFields(handoff.actualContext);

  const allKeys = new Set([
    ...Object.keys(expected),
    ...Object.keys(actual),
    ...(handoff.propagatedFields ?? []),
  ]);

  const diffs: FieldPropagationDiff[] = [];

  for (const field of allKeys) {
    const exp = expected[field];
    const act = actual[field];

    if (exp === undefined && act !== undefined) {
      diffs.push({
        handoffId: handoff.id,
        field,
        expected: null,
        actual: act,
        status: "unexpected",
      });
      continue;
    }

    if (exp !== undefined && act === undefined) {
      diffs.push({
        handoffId: handoff.id,
        field,
        expected: exp,
        actual: null,
        status: "missing",
      });
      continue;
    }

    if (exp !== undefined && act !== undefined) {
      if (normalize(exp) === normalize(act)) {
        diffs.push({
          handoffId: handoff.id,
          field,
          expected: exp,
          actual: act,
          status: "aligned",
        });
      } else {
        diffs.push({
          handoffId: handoff.id,
          field,
          expected: exp,
          actual: act,
          status: "mutated",
        });
      }
    }
  }

  return diffs;
}

export function diffAllHandoffs(
  handoffs: HandoffRecord[],
): FieldPropagationDiff[] {
  return handoffs.flatMap(diffHandoffPropagation);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "_");
}
