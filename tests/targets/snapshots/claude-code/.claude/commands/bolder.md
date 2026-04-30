---
description: Increase visual emphasis on a too-quiet target
---
# /impeccable bolder

## Purpose
Resolve under-emphasized UIs where hierarchy collapses into "all medium".
Promote display tier, primary action, and key value text so the screen
ranks itself in the first three seconds.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Identify the screen's primary value or message. If you cannot, return
   `verdict: "fail"` — bolder is not a fix for ambiguous priority.
2. Promote the primary value to display tier per `typography`.
3. Promote the primary action: increase contrast against its surface to
   the maximum allowed by `color-contrast`; ensure no other element on
   screen exceeds it.
4. Demote or mute every element that competes with the primary; reduce
   their weight or color saturation.
5. Increase white space around the primary cluster per `spatial-design`
   (≥ one step larger than internal gap).
6. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "bolder-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "ruleId": "bolder-promote-primary",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Billing/Card.tsx", "line": 18 },
      "message": "Primary total renders at value tier; hierarchy reads flat.",
      "fix": "Promote to display tier (28px bold) and demote the surrounding labels."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"bolder-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: The screen's primary value cannot be identified.
- `warn`: Primary exists but is rendered at value tier, or competing
  elements have equal contrast.
- `pass`: `changes` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable bolder target=src/screens/Billing/Card.tsx
```

Example output:

```json
{
  "schemaVersion": "bolder-report-v1",
  "verdict": "warn",
  "changes": [
    {
      "ruleId": "bolder-promote-primary",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Billing/Card.tsx", "line": 18 },
      "message": "Total renders at value tier; should be the display tier.",
      "fix": "Promote to display tier and demote surrounding labels to label tier."
    }
  ]
}
```
