# Trajectory Drift

**Drift detection and coordination infrastructure.**  
Understand what destroys compounding — for humans, teams, agents, and organizations in the AI era.

> Not AI observability. Infrastructure for long-term trajectory.

**trajectory-drift** — what destroys compounding (system-side).  
**[trajectory-native](https://github.com/higuseonhye/trajectory-native)** — what compounds (human-side).

Thesis: [STRATEGY.md](docs/STRATEGY.md) · [framework/](framework/)

<p align="center">
  <img src="./assets/screenshots/dashboard-overview.png" alt="Unified drift detection workspace — human + agent coordination (v0.8)" width="800" />
</p>

---

## Why observability is insufficient

Observability explains what failed. Trajectory infrastructure helps **detect drift before failure** — preserving compounding, coherence, and institutional memory.

Modern organizations suffer from drift, fragmentation, decision entropy, and memory loss — not just model errors.

---

## What this is

| Not this | This |
|----------|------|
| AI observability SaaS | Drift detection infrastructure |
| Productivity / PM copilot | Judgment and institutional memory |
| Metric zoo | Drift Radar + intervention |

## Capabilities

- **Drift taxonomy** — prestige, labor, apprentice, noise, organizational, AI drift ([framework/](framework/))
- **Human trajectory** — momentum, interaction starvation (native bridge)
- **Coordination** — multi-lane graph, handoffs, propagation diffs
- **Human–AI coherence** — overrides, async fatigue, authority conflicts
- **Institutional memory** — policies, incidents, persisted patterns
- **Recovery** — trajectory restoration mechanisms

Expanded: [framework/drift-taxonomy/](framework/drift-taxonomy/) · [organizational drift](framework/organizational-drift/) · [coordination taxonomy](docs/drift-taxonomy.md)

---

## Intended integration environments

- LangGraph workflows · MCP-connected systems
- OpenAI agent orchestration · Claude tool pipelines
- Retrieval-heavy workflows · human-in-the-loop coordination
- Organizational memory systems

---

## Live workspace

```bash
npm install && npm run dev
# → http://localhost:3001/dashboard
```

Toggle **Single** / **Multi-agent** / **Unified** (human + system) demos.

---

## Screenshots

<p align="center">
  <img src="./assets/screenshots/dashboard-overview.png" alt="Unified workspace — drift taxonomy + human trajectory bridge" width="800" />
</p>

<p align="center">
  <img src="./assets/screenshots/multi-lane-graph.png" alt="Multi-agent swimlane graph — coordination drift" width="420" />
  <img src="./assets/screenshots/propagation-diff.png" alt="Field-level propagation diffs across handoffs" width="420" />
</p>

<p align="center">
  <img src="./assets/screenshots/calibration-panel.png" alt="Calibration — interpret drift, suggest recalibration" width="420" />
  <img src="./assets/screenshots/journal-panel.png" alt="Adaptation journal — what stabilized across runs" width="420" />
</p>

---

## Architecture

```
core/drift/           alignment & drift detection
core/calibration/     interpret · recovery · journal
core/coordination/    delegation · propagation diffs
core/human-ai/        collaboration coherence
core/org-memory/      institutional patterns
app/                  calm trajectory environment
```

**Docs:** [STRATEGY.md](docs/STRATEGY.md) · [framework/](framework/) · [trajectory-infrastructure.md](docs/trajectory-infrastructure.md) · [bridge.md](docs/bridge.md)

---

## License

MIT
