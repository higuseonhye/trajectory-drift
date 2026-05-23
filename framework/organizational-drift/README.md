# Organizational drift

How organizations lose coherence — mission, alignment, memory, and execution quality.

Prior operational doc: [`docs/organizational-trajectory.md`](../../docs/organizational-trajectory.md)

---

## Drift patterns

### Meeting entropy

**Symptoms:** Calendar density rises; closed loops decrease; decisions made in meetings but not propagated.

**Causes:** Coordination without memory; no decision capture; async gaps.

**Recovery:** Decision memory; institutional memory layer; reduce meeting WIP.

---

### Alignment decay

**Symptoms:** Teams optimize locally; mission diverges from daily work; OKRs and reality disconnect.

**Causes:** Weak "why" propagation; missing mission checkpoints at handoffs.

**Recovery:** Mission checkpoint at delegation boundaries; explicit non-goals in org memory.

---

### Political optimization

**Symptoms:** Status and visibility prioritized over value; credit-seeking; risk avoidance disguised as process.

**Causes:** Reward systems misaligned; prestige drift at org scale.

**Recovery:** Ownership metrics; outcome-linked recognition; drift radar for teams.

---

### Trust collapse

**Symptoms:** Async gaps widen; overrides increase; coordination fatigue rises.

**Causes:** Broken promises; inconsistent standards; unresolved conflicts.

**Recovery:** Trust rebuilding through closed loops; calibration journals.

---

### Institutional memory fragmentation

**Symptoms:** Same incidents repeat; policies exist but aren't enforced; rationale lost at turnover.

**Causes:** No decision memory; stale org memory; agent workflows without propagation validation.

**Recovery:** Org memory layer (`core/org-memory/`); decision extraction; field-level propagation.

---

### Execution theater

**Symptoms:** High activity metrics; low propagation; many initiatives, few outcomes.

**Causes:** Velocity rewarded over continuity; fragmented ownership; entropy from urgent overrides.

**Recovery:** Loop closure metrics; reduce WIP; compounding analysis.

---

## Implementation

| Component | Location |
|-----------|----------|
| Org memory | `core/org-memory/` |
| Coordination | `core/coordination/` |
| Human–AI coherence | `core/human-ai/` |
| Failure archive | `docs/coordination-failures.md` |
| Calibration | `core/calibration/` |

---

## Framework connection

- [`../drift-taxonomy/`](../drift-taxonomy/) — Organizational Drift category
- [`../recovery/`](../recovery/) — recovery mechanisms
- [Institutional Memory product module](https://github.com/higuseonhye/trajectory-native/blob/main/framework/product-mapping/institutional-memory.md)
