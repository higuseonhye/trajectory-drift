/** Human trajectory event — shared with trajectory-native bridge format. */
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
}

export interface TrajectoryEventsBundle {
  events: TrajectoryEvent[];
  /** Adapter that produced this batch. */
  source?: string;
}
