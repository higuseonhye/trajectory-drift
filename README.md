# Trajectory Drift

**Systems for coherent adaptation under unstable contexts.**

Not another AI observability dashboard. Trajectory Drift is a calm coordination and calibration environment — for when adaptation drifts across agents, memory, and delegation chains, not just single-model outputs.

<p align="center">
  <img src="./assets/screenshots/dashboard-overview.png" alt="Calibration workspace" width="800" />
</p>

---

## What this is

| Not this | This |
|----------|------|
| AI observability SaaS | Coordination coherence |
| Hallucination alerts | Adaptive calibration |
| Metric obsession | Context continuity |
| Panic dashboards | Recovery-aware reasoning |

## Capabilities

- **Coherence** — trajectory stable · coherence weakening · grounding unstable
- **Context quality** — stale attachment, weak grounding, carry-over
- **Coordination** — multi-lane graph, handoff fidelity, field-level propagation diffs
- **Human–AI coherence** — async workflows, overrides, coordination fatigue
- **Org memory** — team policies, incident patterns, persisted adaptation memory
- **Calibration** — interpret drift · suggest recalibration
- **Recovery & journal** — what stabilized · adaptation memory across runs

## Live workspace

```bash
npm install && npm run dev
# → http://localhost:3001/dashboard
```

Demo loads automatically. No setup theater.

---

## Screenshots

<p align="center">
  <img src="./assets/screenshots/dashboard-overview.png" alt="Calibration workspace — coherence, journal, recalibration" width="800" />
</p>

<p align="center">
  <img src="./assets/screenshots/graph-closeup.png" alt="Trajectory graph" width="420" />
  <img src="./assets/screenshots/calibration-panel.png" alt="Recalibration suggestions" width="420" />
</p>

<p align="center">
  <img src="./assets/screenshots/journal-panel.png" alt="Calibration journal — adaptation memory" width="720" />
</p>

---

## Architecture

```
core/drift/           alignment & drift detection
core/calibration/     interpret · context · recovery · journal
core/coordination/    delegation · handoff · field propagation diffs
core/human-ai/        human–AI collaboration coherence
core/org-memory/      organizational memory & incident patterns
app/                  calm workspace UI
```

Strategic direction: [docs/STRATEGY.md](./docs/STRATEGY.md)

---

## License

MIT
