# Trajectory Drift

**Anti-drift infrastructure.**  
Most people — and most teams — don't collapse. They **drift quietly**. Notice early. Steer back.

> Not observability. Not productivity. Navigation.

**trajectory-drift** — drift at scale (teams, agents, orgs).  
**[trajectory-native](https://github.com/higuseonhye/trajectory-native)** — personal steering (tiny turns, reality-contact).

Thesis: [STRATEGY.md](docs/STRATEGY.md) · [steering (native)](https://github.com/higuseonhye/trajectory-native/blob/main/docs/steering.md) · [framework/](framework/)

<p align="center">
  <img src="./assets/screenshots/x-post-v08-viewport.png" alt="Anti-drift workspace — quiet drift detection (v0.9)" width="800" />
</p>

---

## Why observability is insufficient

Observability explains what failed **after** collapse.

Drift happens quietly first — unconscious inertia and signal loss, often while metrics still look fine. Trajectory infrastructure catches the fade **before** you wake up in a life you never chose.

---

## What this is

| Not this | This |
|----------|------|
| AI observability SaaS | Quiet drift detection |
| Productivity / habit tracker | Anti-drift + steering |
| Corporate dashboard | Trajectory-aware navigation |

## Capabilities

- **Quiet drift** — inertia, signal loss, fake aliveness, dead-system adaptation ([framework/drift-taxonomy/](framework/drift-taxonomy/))
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
  <img src="./assets/screenshots/dashboard-overview.png" alt="Unified workspace — human trajectory + coordination drift" width="800" />
</p>

<p align="center">
  <img src="./assets/screenshots/multi-lane-graph.png" alt="Multi-agent swimlane graph — coordination drift" width="420" />
  <img src="./assets/screenshots/propagation-diff.png" alt="Field-level propagation diffs across handoffs" width="420" />
</p>

<p align="center">
  <img src="./assets/screenshots/calibration-panel.png" alt="Calibration — interpret drift, suggest a turn" width="420" />
  <img src="./assets/screenshots/journal-panel.png" alt="Calibration journal — what stabilized" width="420" />
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
