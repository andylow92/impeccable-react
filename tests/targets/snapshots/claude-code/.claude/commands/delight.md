---
description: Introduce purposeful moments of delight on a target
---
# /impeccable delight

## Purpose
Add a small number of intentional moments — never decoration. Delight only
attaches to events that already matter (success, completion, milestone),
respects reduced-motion, and survives keyboard-only use.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Identify candidate moments: successful primary action, milestone
   reached, empty-to-first-item transition, error recovery.
2. Reject candidates that do not correspond to a state change the user
   produced. Decoration is not delight.
3. Propose at most **one** moment per surface and at most **three**
   per screen.
4. Each proposed moment must:
   - Attach to a real state change.
   - Use motion within 120–240ms ease-out per `motion-design`.
   - Provide a `prefers-reduced-motion` fallback (text-only confirmation).
   - Provide a keyboard-equivalent confirmation per `interaction-design`.
   - Use specific microcopy per `ux-writing` ("Invoice sent to maya@acme.com",
     not "Awesome!").
5. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "delight-report-v1",
  "verdict": "pass",
  "moments": [
    {
      "trigger": "invoice-send-success",
      "ruleId": "delight-confirm-success",
      "severity": "warn",
      "location": { "path": "src/screens/Billing/InvoiceForm.tsx", "line": 90 },
      "fix": "On success, animate the row entry at 200ms ease-out and toast \"Invoice #1042 sent to maya@acme.com\". Reduced-motion: toast only.",
      "antiPatternId": null
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"delight-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `moments`: required array (use `[]` when none); at most 3 entries per
  invocation.
- `trigger`: required non-empty string naming a real state change.
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).
- `fix`: must describe both the default-motion behavior and the
  reduced-motion fallback.

## Severity rubric
- `fail`: A proposed moment has no causal state change, no reduced-motion
  fallback, or a decorative emoji-only confirmation.
- `warn`: All proposed moments are valid but not yet wired in.
- `pass`: `moments` is `[]` (target already has appropriate moments or
  needs none).

## Example invocation + example output
Invocation:

```text
/impeccable delight target=src/screens/Billing
```

Example output:

```json
{
  "schemaVersion": "delight-report-v1",
  "verdict": "warn",
  "moments": [
    {
      "trigger": "first-invoice-sent",
      "ruleId": "delight-first-activation",
      "severity": "warn",
      "location": { "path": "src/screens/Billing/InvoiceForm.tsx", "line": 90 },
      "fix": "On the user's first successful send, animate a checkmark at 200ms ease-out and toast \"First invoice sent.\" Reduced-motion: toast only, no checkmark.",
      "antiPatternId": null
    }
  ]
}
```
