import type { HumanAiBundle, HumanAiInteraction } from "@/core";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const INTERACTION_KINDS = new Set([
  "operator_review",
  "human_override",
  "async_handoff",
  "agent_response",
  "escalation",
  "context_note",
]);

const ACTORS = new Set(["human", "agent", "system"]);

function parseInteraction(raw: unknown, index: number): HumanAiInteraction {
  if (!isRecord(raw)) {
    throw new Error(`humanAi.interactions[${index}] must be an object`);
  }
  if (typeof raw.id !== "string" || typeof raw.content !== "string") {
    throw new Error(`humanAi.interactions[${index}] requires id and content`);
  }
  const kind = raw.kind;
  const actor = raw.actor;
  if (typeof kind !== "string" || !INTERACTION_KINDS.has(kind)) {
    throw new Error(`humanAi.interactions[${index}]: invalid kind`);
  }
  if (typeof actor !== "string" || !ACTORS.has(actor)) {
    throw new Error(`humanAi.interactions[${index}]: invalid actor`);
  }
  const interaction: HumanAiInteraction = {
    id: raw.id,
    kind: kind as HumanAiInteraction["kind"],
    actor: actor as HumanAiInteraction["actor"],
    content: raw.content,
  };
  if (typeof raw.latencyMinutes === "number") {
    interaction.latencyMinutes = raw.latencyMinutes;
  }
  return interaction;
}

export function parseHumanAiBundle(json: unknown): HumanAiBundle | undefined {
  if (!isRecord(json) || json.humanAi === undefined) return undefined;
  const block = json.humanAi;
  if (!isRecord(block) || !Array.isArray(block.interactions)) {
    throw new Error("humanAi requires interactions array");
  }
  const bundle: HumanAiBundle = {
    interactions: block.interactions.map(parseInteraction),
  };
  if (isRecord(block.signals)) {
    const s = block.signals;
    bundle.signals = {
      asyncWorkflow: s.asyncWorkflow === true,
      humanOverrides:
        typeof s.humanOverrides === "number" ? s.humanOverrides : undefined,
      sessionLengthMinutes:
        typeof s.sessionLengthMinutes === "number"
          ? s.sessionLengthMinutes
          : undefined,
      concurrentThreads:
        typeof s.concurrentThreads === "number" ? s.concurrentThreads : undefined,
    };
  }
  return bundle;
}
