# Product overview

Trajectory Drift is an **AI agent observability** product. It helps engineering teams detect when live agent runs diverge from approved execution paths.

## Core workflow

1. Define a golden trajectory (expected agent steps).
2. Ingest a live run as JSON logs.
3. Review graph, drift score, and remediation report.

## Drift signals

| Type | Example |
|------|---------|
| Missing step | `retrieve_knowledge` never called |
| Hallucination | Observation not grounded in KB |
| Deviation | Wrong tool or response content |

## Demo scenario

`demo-agent-run.json` — support agent answering refund policy questions.

- **Reference:** KB retrieval → validation → correct policy response
- **Actual:** web search → hallucinated policy → skipped validation → incorrect response

## Positioning

- **Is:** Agent run comparison & drift detection
- **Is not:** A general LLM eval framework, prompt playground, or research prototype
