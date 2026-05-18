# Trajectory Drift

**Adaptive trajectory calibration for AI systems.**

Detecting drift is only the first step. The real goal is **maintaining trajectory stability under changing contexts** — through observation, interpretation, recalibration, and adaptation.

<p align="center">
  <img src="./assets/screenshots/dashboard-overview.png" alt="Trajectory Drift calibration dashboard" width="900" />
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="/dashboard">Live demo</a> ·
  <a href="docs/PRODUCT.md">Product</a>
</p>

---

## The shift

| Before | Now |
|--------|-----|
| Observe → detect drift | Observe → detect → **interpret** → **recalibrate** → **adapt** |
| Execution errors | Failures of **adaptation and calibration** under uncertainty |
| Monitoring dashboard | **Behavioral adaptation** system |

AI failures are not only wrong outputs. They are breakdowns in how systems maintain coherent behavior over time.

---

## What it does

### Calibration layer
Interprets *why* trajectories drift and suggests **behavioral recalibration** — not alarm-style error logs.

> *The system appears to over-weight conversational carry-over while under-weighting retrieval grounding.*
>
> **Suggested calibration:** increase retrieval priority · insert grounding checkpoint · reduce memory carry-over weight

### Weak signal interpretation
Treats subtle patterns as instability precursors: retries, hesitation loops, retrieval avoidance, chain instability, context carry-over.

### Trajectory forecasting
Estimates whether a run is **likely becoming unstable** — enabling proactive calibration.

### Calibration memory
Tracks prior drift events, corrections, and stabilization patterns (local persistence, MVP).

---

## Screenshots

### Calibration dashboard
Continuity score, instability forecast, weak signals, and the calibration layer — one surface.

<p align="center">
  <img src="./assets/screenshots/dashboard-overview.png" alt="Calibration dashboard overview" width="800" />
</p>

### Trajectory graph · Calibration panel · Timeline replay

<p align="center">
  <img src="./assets/screenshots/graph-closeup.png" alt="Trajectory graph with drift highlights" width="480" />
  <img src="./assets/screenshots/calibration-panel.png" alt="Calibration layer with recalibration suggestions" width="480" />
</p>

<p align="center">
  <img src="./assets/screenshots/timeline-replay.png" alt="Execution timeline replay" width="800" />
</p>

---

## Live demo

Zero-click demo — sample scenario loads automatically:

```bash
npm install && npm run dev
# → http://localhost:3001/dashboard
```

Landing: `http://localhost:3001`

---

## Architecture

```
core/
  drift/         # Detection
  calibration/   # Interpret, forecast, memory
  report/        # Structured findings
ingestion/       # Log pipeline
app/             # Landing + calibration UI
```

**Pipeline:** `ingest → detect → calibrate → persist memory`

---

## Quick start

```bash
git clone https://github.com/higuseonhye/trajectory-drift.git
cd trajectory-drift
npm install
npm run dev
```

Log format: `{ "reference": { "steps": [...] }, "actual": { "steps": [...] } }`  
Sample: [`public/demo-agent-run.json`](public/demo-agent-run.json)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3001) |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |

---

## Roadmap

- [ ] Production embedding providers
- [ ] API ingestion + team calibration memory
- [ ] Reinforcement from stabilization outcomes

---

## License

MIT — see [LICENSE](LICENSE).
