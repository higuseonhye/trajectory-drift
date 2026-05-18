# Coordination failure archive

Operational cases from adaptive system runs. Names and IDs are illustrative; patterns are recurring.

See taxonomy: [drift-taxonomy.md](./drift-taxonomy.md)

---

### Case 01 — Retrieval abandonment drift

**Observed:**  
The planning agent initially referenced retrieval outputs correctly, but gradually relied more on conversational momentum during recursive refinement.

**Result:**  
Final synthesis became internally coherent but weakly grounded.

**Failure mode:**  
Grounding drift caused by recursive confidence escalation.

**Recovery:**  
Inserted forced retrieval reconciliation checkpoint before synthesis stage.

**Outcome:**  
Grounding stability improved across subsequent runs.

---

### Case 02 — Delegation memory fragmentation

**Observed:**  
Agent B inherited partial task context from Agent A but omitted policy constraints stored earlier in the chain.

**Result:**  
The workflow completed successfully while violating organizational memory constraints.

**Failure mode:**  
Delegation continuity degradation.

**Recovery:**  
Added persistent memory propagation validation between handoff stages (field-level diff at boundary).

**Outcome:**  
Constraint retention stabilized across delegation chains.

---

### Case 03 — Human override incoherence

**Observed:**  
Human operators repeatedly injected urgent manual overrides into the workflow without updating downstream context state.

**Result:**  
Agents adapted to conflicting authority signals and coordination quality weakened.

**Failure mode:**  
Async override conflict.

**Recovery:**  
Introduced explicit override reconciliation layer before downstream execution.

**Outcome:**  
Coordination coherence improved under high-interruption conditions.

---

### Case 04 — Forum source substitution

**Observed:**  
Retrieval sub-agent swapped `source=internal_kb` for `source=web_search` at delegation boundary. Orchestrator synthesized from forum anecdotes.

**Result:**  
User-facing reply was confident and tone-consistent; policy facts were wrong.

**Failure mode:**  
Grounding desync + context mutation (see demo: `demo-coordination-run.json`).

**Recovery:**  
Pinned grounding source in delegation contract; field propagation checklist at handoff.

**Outcome:**  
`verification_status` and `policy_id` required fields before synthesis.

---

### Case 05 — Stale org memory repeat

**Observed:**  
Team had recorded incident “forum source caused policy drift” six weeks prior. New run repeated the same propagation break without triggering incident-aware guard.

**Result:**  
Organizational memory existed but did not constrain the live workflow.

**Failure mode:**  
Stale policy reinforcement + incident repeat.

**Recovery:**  
Org memory layer compares current run against persisted incidents before delegation proceeds.

**Outcome:**  
Prior resolution (“KB-only delegation”) surfaced as required calibration step.

---

*Add cases as you observe them. Prefer: observed → result → failure mode → recovery → outcome.*
