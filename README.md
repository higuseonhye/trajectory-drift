# Trajectory Drift

**System-side adaptive coherence** — coordination, memory, and recalibration for agents and workflows under unstable contexts.

Not another AI observability dashboard. A calm environment for when adaptation drifts across agents, delegation chains, and organizational memory — not just single-model outputs.

**[trajectory-native](https://github.com/higuseonhye/trajectory-native)** explores human adaptation coherence.  
**trajectory-drift** (this repo) explores system coordination coherence.

Shared thesis: [adaptive coherence under unstable contexts](docs/adaptive-coherence.md).

<p align="center">
  <img src="./assets/screenshots/dashboard-overview.png" alt="Multi-agent coordination workspace" width="800" />
</p>

---

## Why observability is insufficient

Observability explains what failed.

Adaptive systems also require:

- continuity
- coordination coherence
- adaptation memory
- recovery-aware reasoning
- contextual recalibration

Trajectory Drift explores systems that remain coherent while adapting under unstable conditions.

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

Grounded examples: [coordination failure archive](docs/coordination-failures.md) · [drift taxonomy](docs/drift-taxonomy.md)

---

## Intended integration environments

Trajectory Drift is designed for adaptive systems involving:

- LangGraph workflows
- MCP-connected systems
- OpenAI agent orchestration
- Claude tool pipelines
- retrieval-heavy workflows
- human-in-the-loop coordination environments
- organizational memory systems

---

## Ecosystem

| Repo | Layer |
|------|--------|
| **[trajectory-native](https://github.com/higuseonhye/trajectory-native)** | Founder calibration · weak-signal interpretation · human recalibration |
| **trajectory-drift** (this repo) | Multi-agent handoffs · propagation diffs · org memory · coordination drift |

---

## Live workspace

```bash
npm install && npm run dev
# → http://localhost:3001/dashboard
```

Demo loads automatically. Toggle **Single** / **Multi-agent** in the workspace.

---

## Screenshots

<p align="center">
  <img src="./assets/screenshots/dashboard-overview.png" alt="Coordination, human–AI, and org memory panels" width="800" />
</p>

<p align="center">
  <img src="./assets/screenshots/multi-lane-graph.png" alt="Multi-agent swimlane graph" width="420" />
  <img src="./assets/screenshots/propagation-diff.png" alt="Field-level propagation diffs" width="420" />
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

**Docs:** [STRATEGY.md](docs/STRATEGY.md) · [PRODUCT.md](docs/PRODUCT.md) · [adaptive-coherence.md](docs/adaptive-coherence.md)

---

## License

MIT
