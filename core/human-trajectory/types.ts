/** Human trajectory event — shared with trajectory-native bridge format. */

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

export type TrajectoryEventKind =
  | "interaction"
  | "action_taken"
  | "action_avoided"
  | "momentum_gain"
  | "momentum_loss"
  | "entropy_spike"
  | "energy_restore"
  | "execution_collapse"
  | "environment_alignment"
  | "loop_unfinished";

export interface TrajectoryEvent {
  id: string;
  kind: TrajectoryEventKind;
  timestamp: string;
  subject?: string;
  description: string;
  momentumDelta?: number;
  tags?: string[];
  environment?: EventEnvironment;
}

export interface TrajectoryEventsBundle {
  events: TrajectoryEvent[];
  /** Adapter that produced this batch. */
  source?: string;
}
