# Triage Labels

The `triage` skill uses these labels to move issues through a state machine. Each label represents a state of readiness.

## The five states

| Label | Meaning | Next step |
|-------|---------|-----------|
| `needs-triage` | Maintainer needs to evaluate the issue | Maintainer reviews, then applies `needs-info`, `ready-for-agent`, or `wontfix` |
| `needs-info` | Waiting on reporter for clarification | Reporter responds; maintainer re-triages |
| `ready-for-agent` | Fully specified, context complete, AFK agent can pick it up | Assign to an agent or human implementer |
| `ready-for-human` | Needs human implementation (not AI-solvable, blocked on external decision, etc.) | Assign to a human and implement |
| `wontfix` | Will not be actioned | Close the issue |

## Applying labels

- New issues start with no label (or you can auto-label incoming issues in GitHub settings)
- Use the `triage` skill to move issues through states: it applies the right label based on your assessment
- If an issue needs more info, apply `needs-info` and add a comment; the reporter responds and you re-triage
- Once fully specified, apply `ready-for-agent` (if an AFK agent can solve it) or `ready-for-human` (if it needs human judgment)

## If you use different label names

If your repo already uses different names (e.g., `bug:triage` instead of `needs-triage`), edit the mapping below and re-run the `setup-matt-pocock-skills` skill:

```
needs-triage → needs-triage
needs-info → needs-info
ready-for-agent → ready-for-agent
ready-for-human → ready-for-human
wontfix → wontfix
```

(This is a placeholder — update if you customize.)
