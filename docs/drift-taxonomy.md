# Coordination drift taxonomy

Categories of coherence loss in adaptive systems. Each entry is meant for **operational triage**, not taxonomy for its own sake.

---

## delegation drift

**Definition:** Sub-agents or downstream steps diverge from the intent encoded at handoff time.

**Symptoms:** Completed tasks with wrong constraints; “success” that violates delegation contract.

**Likely causes:** Vague handoff payloads; missing propagated fields; role ambiguity.

**Recovery:** Explicit delegation contracts; field-level propagation validation; sync checkpoint before synthesis.

---

## grounding divergence

**Definition:** Reasoning becomes self-consistent while connection to authoritative sources weakens.

**Symptoms:** High fluency; low citation fidelity; retrieval skipped in later steps.

**Likely causes:** Recursive refinement; confidence escalation; cost/latency pressure on retrieval.

**Recovery:** Forced retrieval reconciliation; grounding pins in system prompts; pre-synthesis audit.

---

## recursive escalation drift

**Definition:** Each refinement round increases commitment to the current narrative without fresh evidence.

**Symptoms:** Growing answer length; decreasing tool use; “we already know” tone in traces.

**Likely causes:** Looping planner–critic patterns; missing stop conditions.

**Recovery:** Max-depth guards; mandatory external check every N steps; reset context window with evidence summary.

---

## stale memory propagation

**Definition:** Outdated context from earlier sessions or agents persists into current decisions.

**Symptoms:** References to revoked policies; wrong user state; old incident assumptions.

**Likely causes:** Long-lived memory without TTL; handoff without field invalidation.

**Recovery:** Memory versioning; TTL on org facts; explicit “context as of” timestamps at handoff.

---

## async override conflict

**Definition:** Human interventions change intent without reconciling downstream agent state.

**Symptoms:** Agents follow pre-override plan; contradictory tool calls; coordination fatigue signals.

**Likely causes:** Urgent ops culture; missing override broadcast; no reconciliation layer.

**Recovery:** Override event schema; pause–reconcile–resume; journal entry for human corrections.

---

## retrieval abandonment drift

**Definition:** Systems stop consulting retrieval after early steps despite task requiring grounded facts.

**Symptoms:** Tool trace shows retrieval once, then none; answers drift from KB.

**Likely causes:** Latency optimization; over-trust in prior observations.

**Recovery:** Retrieval required gates; drift rules on “missing later retrieval”; demo case 01 pattern.

---

## context carry-over contamination

**Definition:** Irrelevant or wrong context from a prior subtask bleeds into the current one.

**Symptoms:** Wrong entity names; mixed scenarios in one reply; conflicting_memory signals.

**Likely causes:** Shared buffer without scoping; weak session boundaries.

**Recovery:** Scoped context windows per subtask; decontamination step at handoff.

---

## coordination fatigue

**Definition:** Quality of human–AI or multi-agent interaction degrades under duration, load, or interruption.

**Symptoms:** Long async gaps; repeated overrides; declining coherence scores in human–AI panel.

**Likely causes:** High concurrent threads; long sessions; alert fatigue.

**Recovery:** Session boundaries; context refresh; reduce concurrent delegation depth.

---

## role identity drift

**Definition:** An agent’s effective role shifts mid-workflow (e.g. planner begins executing without re-grounding).

**Symptoms:** Tool misuse; tone shift; steps that belong to another lane appear in wrong agent trace.

**Likely causes:** Prompt ambiguity; missing role locks; emergent “helpfulness.”

**Recovery:** Role tags per step; lane validation in multi-agent graph; reject out-of-role actions.

---

See failures: [coordination-failures.md](./coordination-failures.md) · thesis: [adaptive-coherence.md](./adaptive-coherence.md)
