# Native ↔ drift bridge

## Export from trajectory-native

1. Open http://localhost:3000
2. **Download bridge JSON** from the bridge panel
3. Open http://localhost:3001/dashboard
4. Upload the JSON or switch demo to **Unified**

## Payload shape

```json
{
  "trajectoryEvents": [
    {
      "id": "te1",
      "kind": "interaction",
      "timestamp": "2026-05-17T14:00:00Z",
      "subject": "accelerator office hours",
      "description": "...",
      "momentumDelta": 1
    }
  ],
  "trajectoryEventsSource": "trajectory-native",
  "reference": { },
  "actual": { }
}
```

Human events can be combined with agent `reference` / `actual` and `coordination` blocks in one file.

## Ingest adapters (native)

| Source | Shape |
|--------|--------|
| Native events | `{ "trajectoryEvents": [...] }` |
| Calendar | `{ "source": "calendar", "items": [...] }` |
| Comms | `{ "source": "comms", "messages": [...] }` |
| Tools | `{ "source": "tools", "actions": [...] }` |

Samples: `trajectory-native/public/samples/`
