import type {
  TrajectoryEvent,
  TrajectoryEventKind,
  EnvironmentContext,
  EnvironmentAtmosphere,
  EventEnvironment,
} from "@/core/human-trajectory/types";

const KINDS = new Set<TrajectoryEventKind>([
  "interaction",
  "action_taken",
  "action_avoided",
  "momentum_gain",
  "momentum_loss",
  "entropy_spike",
  "energy_restore",
  "execution_collapse",
  "environment_alignment",
  "loop_unfinished",
]);

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const ENV_CONTEXTS = new Set<EnvironmentContext>([
  "office",
  "home",
  "nature",
  "transit",
  "social",
  "digital",
]);

const ENV_ATMOSPHERES = new Set<EnvironmentAtmosphere>([
  "alive",
  "neutral",
  "dead",
  "restorative",
]);

function normalizeEnvironment(raw: unknown): EventEnvironment | undefined {
  if (!isRecord(raw)) return undefined;
  const context =
    typeof raw.context === "string" &&
    ENV_CONTEXTS.has(raw.context as EnvironmentContext)
      ? (raw.context as EnvironmentContext)
      : undefined;
  const atmosphere =
    typeof raw.atmosphere === "string" &&
    ENV_ATMOSPHERES.has(raw.atmosphere as EnvironmentAtmosphere)
      ? (raw.atmosphere as EnvironmentAtmosphere)
      : undefined;
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === "string")
    : undefined;
  if (!context && !atmosphere && !tags?.length) return undefined;
  return { context, atmosphere, tags };
}

function normalizeEvent(raw: unknown, index: number): TrajectoryEvent {
  if (!isRecord(raw)) {
    throw new Error(`trajectoryEvents[${index}] must be an object`);
  }
  const kind = raw.kind;
  if (typeof kind !== "string" || !KINDS.has(kind as TrajectoryEventKind)) {
    throw new Error(`trajectoryEvents[${index}]: invalid kind`);
  }
  if (typeof raw.description !== "string") {
    throw new Error(`trajectoryEvents[${index}]: description required`);
  }
  const event: TrajectoryEvent = {
    id: typeof raw.id === "string" ? raw.id : `evt-${index}`,
    kind: kind as TrajectoryEventKind,
    timestamp:
      typeof raw.timestamp === "string"
        ? raw.timestamp
        : new Date().toISOString(),
    description: raw.description,
  };
  if (typeof raw.subject === "string") event.subject = raw.subject;
  if (typeof raw.momentumDelta === "number") {
    event.momentumDelta = raw.momentumDelta;
  }
  if (Array.isArray(raw.tags)) {
    event.tags = raw.tags.filter((t): t is string => typeof t === "string");
  }
  if (raw.environment !== undefined) {
    event.environment = normalizeEnvironment(raw.environment);
  }
  return event;
}

function parseCalendarItems(items: unknown[]): TrajectoryEvent[] {
  return items.map((item, i) => {
    if (!isRecord(item)) throw new Error(`calendar.items[${i}] invalid`);
    const attendees = Array.isArray(item.attendees)
      ? item.attendees.filter((a): a is string => typeof a === "string").join(", ")
      : undefined;
    return {
      id: `cal-${i}`,
      kind: "interaction" as const,
      timestamp:
        typeof item.start === "string"
          ? item.start
          : new Date().toISOString(),
      subject: attendees || (typeof item.summary === "string" ? item.summary : "calendar"),
      description:
        typeof item.summary === "string"
          ? item.summary
          : "Calendar interaction",
      momentumDelta: item.cancelled === true ? -1 : 1,
      tags: ["ingested", "calendar"],
    };
  });
}

function parseCommsMessages(messages: unknown[]): TrajectoryEvent[] {
  return messages.map((msg, i) => {
    if (!isRecord(msg)) throw new Error(`comms.messages[${i}] invalid`);
    const negative = /urgent|override|conflict|stale/i.test(
      String(msg.body ?? ""),
    );
    return {
      id: `comms-${i}`,
      kind: negative ? ("entropy_spike" as const) : ("interaction" as const),
      timestamp:
        typeof msg.at === "string" ? msg.at : new Date().toISOString(),
      subject:
        typeof msg.channel === "string"
          ? `${msg.channel}${msg.from ? ` · ${msg.from}` : ""}`
          : "comms",
      description: typeof msg.body === "string" ? msg.body.slice(0, 200) : "",
      momentumDelta: negative ? -1 : 1,
      tags: ["ingested", "comms"],
    };
  });
}

function parseToolActions(actions: unknown[]): TrajectoryEvent[] {
  return actions.map((act, i) => {
    if (!isRecord(act)) throw new Error(`tools.actions[${i}] invalid`);
    const avoided = /skipped|deferred|cancelled/i.test(String(act.action ?? ""));
    return {
      id: `tool-${i}`,
      kind: avoided ? ("action_avoided" as const) : ("action_taken" as const),
      timestamp:
        typeof act.at === "string" ? act.at : new Date().toISOString(),
      subject: typeof act.tool === "string" ? act.tool : "tool",
      description: typeof act.action === "string" ? act.action : "Tool action",
      momentumDelta: avoided ? -1 : 1,
      tags: ["ingested", "tools"],
    };
  });
}

/** Parse human trajectory events from bridge or adapter payloads. */
export function parseTrajectoryEventsBundle(
  json: unknown,
): { events: TrajectoryEvent[]; source?: string } | undefined {
  if (!isRecord(json)) return undefined;

  if (json.trajectoryEvents !== undefined) {
    const block = json.trajectoryEvents;
    if (Array.isArray(block)) {
      return {
        events: block.map(normalizeEvent),
        source:
          typeof json.trajectoryEventsSource === "string"
            ? json.trajectoryEventsSource
            : "native-bridge",
      };
    }
    if (isRecord(block) && Array.isArray(block.events)) {
      return {
        events: block.events.map(normalizeEvent),
        source: typeof block.source === "string" ? block.source : "bundle",
      };
    }
  }

  if (Array.isArray(json.events)) {
    return { events: json.events.map(normalizeEvent), source: "events" };
  }

  if (json.source === "calendar" && Array.isArray(json.items)) {
    return { events: parseCalendarItems(json.items), source: "calendar" };
  }

  if (json.source === "comms" && Array.isArray(json.messages)) {
    return { events: parseCommsMessages(json.messages), source: "comms" };
  }

  if (json.source === "tools" && Array.isArray(json.actions)) {
    return { events: parseToolActions(json.actions), source: "tools" };
  }

  return undefined;
}
