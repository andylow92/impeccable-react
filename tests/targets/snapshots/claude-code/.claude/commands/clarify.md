---
description: Audit and rewrite microcopy against the ux-writing reference
---
# /impeccable clarify

## Purpose
Verify every button, error, empty state, and confirmation names the action,
the state, or the next step. Strip filler. Keep nouns consistent.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Inventory every user-visible string in the target: button labels, form
   labels, error messages, empty states, confirmations, tooltips.
2. Flag buttons whose label is generic (`Submit`, `OK`, `Continue`, `Done`)
   without the action verb + object pair.
3. Flag errors that lack a cause, a scope, or a corrective action; flag
   apologetic phrasing (`Oops`, `Whoops`).
4. Flag empty states that say `No data` / `Nothing here` without naming the
   entity, the reason, and the primary action.
5. Flag filler words (`just`, `simply`, `easily`, `please`).
6. Flag noun drift: same concept referred to by multiple terms across the
   flow (e.g. `project` vs `item` vs `entry`).
7. Flag numbers, dates, prices missing timezone, currency, or unit.
8. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "clarify-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "ruleId": "clarify-generic-button",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/screens/Billing/InvoiceForm.tsx",
        "line": 42
      },
      "message": "Button label \"Submit\" does not name the outcome.",
      "fix": "Replace with \"Send invoice\"."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"clarify-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: An error message gives no cause and no corrective action **or** a
  destructive confirmation does not name what will be deleted.
- `warn`: Generic button labels, filler words, vague empty states, noun
  drift, or numbers without units.
- `pass`: `changes` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable clarify target=src/screens/Billing
```

Example output:

```json
{
  "schemaVersion": "clarify-report-v1",
  "verdict": "fail",
  "changes": [
    {
      "ruleId": "clarify-empty-error",
      "severity": "fail",
      "antiPatternId": null,
      "location": {
        "path": "src/screens/Billing/InvoiceForm.tsx",
        "line": 88
      },
      "message": "\"Oops! Something went wrong. Please try again.\" gives no cause and no action.",
      "fix": "Replace with \"We couldn't reach the billing service. Retry, or contact support if the issue persists.\" plus a Retry control."
    },
    {
      "ruleId": "clarify-noun-drift",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/screens/Billing/InvoiceList.tsx",
        "line": 6
      },
      "message": "Empty state uses \"items\" while the rest of the flow says \"invoices\".",
      "fix": "Replace \"items\" with \"invoices\" everywhere in this flow."
    }
  ]
}
```
