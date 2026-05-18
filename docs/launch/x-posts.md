# X.com launch posts

Visuals: `assets/screenshots/` and `assets/launch/`

---

## Post 1 — Launch (main)

Shipped an MVP for AI agent observability.

Trajectory Drift ingests agent execution logs, builds a step-level graph, and flags:
→ missing retrieval
→ hallucinated observations
→ semantic drift from golden runs

Live demo loads automatically. No setup theater.

[screenshot: dashboard-overview.png]

Building in public. Feedback welcome.

#AI #Agents #Observability #BuildInPublic

---

## Post 2 — Technical hook

Your agent didn't "fail" — it drifted.

We compare live trajectories vs a golden reference:
• embedding similarity per step
• rule checks for missing tools & ungrounded outputs
• severity-scored report with suggested fixes

[screenshot: graph-closeup.png]

Open source MVP → link in bio

---

## Post 3 — Problem / solution

Logs tell you *what* happened.
Trajectory Drift tells you *where* the run diverged.

Support agent demo:
- skipped `retrieve_knowledge`
- hallucinated refund policy from web search
- returned wrong answer to user

[screenshot: drift-report.png]

Demo-ready dashboard. Link below.

---

## Post 4 — Build in public

Week N: agent observability MVP

Stack:
- Next.js + TypeScript
- D3 trajectory graphs
- drift engine (embeddings + rules)
- auto-generated remediation reports

[screenshot: timeline-replay.png]

Not a framework. One product, one job: catch agent drift early.

---

## Post 5 — Investor-readable

AI agents are going to production faster than observability tooling.

We're building Trajectory Drift — step-level drift detection for agent runs.

MVP today:
✓ log ingestion
✓ graph visualization
✓ drift scoring + reports
✓ zero-click demo

DMs open for design partners.

---

## Thread starter (optional)

🧵 Why we're building Trajectory Drift

1/ Agents are chains of steps, not single prompts
2/ Production failures are often *structural* (skipped retrieval, wrong tool)
3/ You need a golden trajectory to compare against
4/ We built the smallest tool that does this end-to-end

Demo: [your-url]/dashboard
