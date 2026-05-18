/** Public demo datasets served from /public */
export const DEMO_LOG_URL = "/demo-agent-run.json";
export const DEMO_LOG_NAME = "demo-agent-run.json";

export const COORDINATION_DEMO_URL = "/demo-coordination-run.json";
export const COORDINATION_DEMO_NAME = "demo-coordination-run.json";

export type DemoMode = "single" | "coordination";

export const DEMOS: Record<
  DemoMode,
  { url: string; name: string; label: string }
> = {
  single: {
    url: DEMO_LOG_URL,
    name: DEMO_LOG_NAME,
    label: "Single-agent calibration",
  },
  coordination: {
    url: COORDINATION_DEMO_URL,
    name: COORDINATION_DEMO_NAME,
    label: "Multi-agent coordination",
  },
};
