---
description: Run the full pre-ship gate before merging UI changes
---
# /impeccable pre-ship-gate

You are the last reviewer before this UI ships. Treat this as a hard gate.

## Procedure
1. Walk the preflight checklist in `impeccable-ui`. Every unchecked box is a blocker.
2. Walk the layer-boundary rules in `impeccable-react`. Any violation is a blocker.
3. Walk the hard rules in `impeccable-typescript`. Any `any`, unparsed external data,
   or duplicated domain type is a blocker.
4. Cross-reference against the anti-pattern library. If a finding matches an
   anti-pattern, cite the id (e.g. `generic-saas-card`).
5. Produce a verdict.

## Output (JSON, conforms to `gate-report-v1`)

```json
{
  "verdict": "pass | fail",
  "blockers": [
    { "rule": "ui-generic-saas-card", "where": "Card.tsx:11", "fix": "..." }
  ],
  "warnings": []
}
```

If `verdict` is `fail`, the change does not merge. Do not soften the verdict to
keep the author moving. The whole point of the gate is that it can stop work.
