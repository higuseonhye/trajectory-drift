/** Environment & state — embodied trajectory context (bridge-compatible). */

import type { TrajectoryEvent } from "./types";

export type EnvironmentContext =
  | "office"
  | "home"
  | "nature"
  | "transit"
  | "social"
  | "digital";

export type EnvironmentAtmosphere =
  | "alive"
  | "neutral"
  | "dead"
  | "restorative";

export interface EventEnvironment {
  context?: EnvironmentContext;
  atmosphere?: EnvironmentAtmosphere;
  tags?: string[];
}

const DEAD_TAGS = new Set([
  "fluorescent",
  "sterile",
  "scroll-feed",
  "indoor-loop",
  "sensory-flat",
]);

const ALIVE_TAGS = new Set([
  "natural-light",
  "nature",
  "cinematic-scale",
  "warm",
  "plants",
  "ocean",
]);

export function isDeadEnvironment(env?: EventEnvironment): boolean {
  if (!env) return false;
  if (env.atmosphere === "dead") return true;
  return env.tags?.some((t) => DEAD_TAGS.has(t)) ?? false;
}

export function isRestorativeEnvironment(env?: EventEnvironment): boolean {
  if (!env) return false;
  if (env.atmosphere === "restorative" || env.atmosphere === "alive")
    return true;
  return env.tags?.some((t) => ALIVE_TAGS.has(t)) ?? false;
}

export interface EnvironmentDriftMetrics {
  deadCount: number;
  restorativeCount: number;
  deadRatio: number;
  indoorLoop: boolean;
  scrollDominance: boolean;
  aweDeprivation: boolean;
  taggedEventCount: number;
}

export function computeEnvironmentDrift(
  events: TrajectoryEvent[],
  windowMs = 7 * 24 * 60 * 60 * 1000,
  now = Date.now(),
): EnvironmentDriftMetrics {
  const recent = events.filter(
    (e) => now - new Date(e.timestamp).getTime() <= windowMs,
  );
  const withEnv = recent.filter((e) => e.environment);
  const deadCount = withEnv.filter((e) =>
    isDeadEnvironment(e.environment),
  ).length;
  const restorativeCount = withEnv.filter((e) =>
    isRestorativeEnvironment(e.environment),
  ).length;
  const deadRatio =
    withEnv.length > 0 ? Math.round((deadCount / withEnv.length) * 100) : 0;

  const indoorLoop =
    withEnv.length >= 2 &&
    withEnv.filter(
      (e) =>
        e.environment?.context === "office" ||
        e.environment?.context === "digital",
    ).length >=
      Math.max(2, withEnv.length - 1);

  const scrollDominance = withEnv.some(
    (e) =>
      e.environment?.context === "digital" &&
      e.environment?.tags?.includes("scroll-feed"),
  );

  const aweDeprivation =
    withEnv.length >= 3 &&
    !withEnv.some(
      (e) =>
        e.environment?.context === "nature" ||
        e.environment?.tags?.includes("cinematic-scale") ||
        e.environment?.atmosphere === "restorative",
    );

  return {
    deadCount,
    restorativeCount,
    deadRatio,
    indoorLoop,
    scrollDominance,
    aweDeprivation,
    taggedEventCount: withEnv.length,
  };
}

export const ENVIRONMENT_CONTEXT_LABELS: Record<EnvironmentContext, string> = {
  office: "office",
  home: "home",
  nature: "nature",
  transit: "transit",
  social: "social",
  digital: "digital",
};

export const ENVIRONMENT_ATMOSPHERE_LABELS: Record<
  EnvironmentAtmosphere,
  string
> = {
  alive: "alive",
  neutral: "neutral",
  dead: "dead",
  restorative: "restorative",
};
