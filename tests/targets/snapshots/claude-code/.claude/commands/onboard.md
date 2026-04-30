---
description: Design a first-run flow that drives the user to a single activation step
---
# /impeccable onboard

## Purpose
Audit or draft the first-run experience: zero-state screens, primary
activation step, and the first specific action a new user can take. Reject
generic "Welcome!" patterns that don't move the user forward.

## Inputs
- `target` (required, `path`): repo or app directory.

## Procedure
1. Read `PRODUCT.md` if present to extract the product noun and primary
   user job.
2. Identify the activation step: the single action that converts a new
   user into an engaged user (e.g. "send first invoice").
3. Audit each empty state (per `ux-writing`) for entity + reason +
   primary action.
4. Audit the welcome screen for one primary CTA whose label names the
   activation step (per `ux-writing`). Flag generic "Get started" /
   "Welcome!" labels.
5. Audit the activation step's flow for state completeness per
   `interaction-design`: pending / success / failure all present.
6. Draft any missing zero-state copy as `actions[]` patches (full file
   contents only when no file exists; otherwise inline `fix`).
7. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "onboard-report-v1",
  "verdict": "pass",
  "activationStep": "Send first invoice",
  "changes": [
    {
      "category": "empty-state",
      "ruleId": "onboard-vague-empty",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Invoices/Empty.tsx", "line": 8 },
      "message": "Empty state says \"Nothing here yet\" without naming the activation step.",
      "fix": "Replace with \"No invoices yet — send your first invoice to start tracking.\""
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"onboard-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `activationStep`: required string or `null` if it cannot be inferred.
- `changes`: required array (use `[]` when none).
- `category`: enum, one of `"welcome" | "empty-state" | "activation-flow" |
  "copy" | "state"`.
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: No activation step can be identified **or** the activation flow
  has no failure UI.
- `warn`: Generic welcome copy, vague empty states, or missing zero-state
  microcopy.
- `pass`: `changes` is `[]` and `activationStep` is non-null.

## Example invocation + example output
Invocation:

```text
/impeccable onboard target=.
```

Example output:

```json
{
  "schemaVersion": "onboard-report-v1",
  "verdict": "warn",
  "activationStep": "Send first invoice",
  "changes": [
    {
      "category": "welcome",
      "ruleId": "onboard-generic-welcome",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Welcome.tsx", "line": 12 },
      "message": "Welcome CTA \"Get started\" does not name the activation step.",
      "fix": "Replace with \"Send your first invoice\"."
    }
  ]
}
```
