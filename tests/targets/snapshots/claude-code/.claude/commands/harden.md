---
description: Cover error, empty, overflow, and i18n cases for a target
---
# /impeccable harden

## Purpose
Resolve the unhappy paths: error states, empty states, text overflow,
long content, slow networks, and locale variance. Harden never adds
features — it ensures the target survives the inputs it will actually see.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Inventory every async action in the target and confirm pending /
   success / failure UI per `interaction-design`. Flag missing states.
2. Apply the loading-time bands (300ms / 1s / 10s) per `interaction-design`.
3. Inventory every text region and confirm overflow handling
   (truncation, wrap, or scroll) for content 2× the typical length.
4. Inventory every error message and confirm it satisfies `ux-writing`
   (cause + scope + corrective action). Flag generic apologies.
5. Inventory every empty state and confirm it names the entity, the
   reason, and the primary action.
6. Inventory every numeric/date/currency value and confirm unit,
   timezone, and currency are present.
7. Confirm responsive content reflow at the smallest supported viewport
   per `responsive-design`. Flag horizontal scroll on primary content.
8. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "harden-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "category": "error-state",
      "ruleId": "harden-empty-error",
      "severity": "fail",
      "antiPatternId": null,
      "location": { "path": "src/screens/Billing/InvoiceForm.tsx", "line": 88 },
      "message": "Submit failure shows \"Something went wrong\" with no cause and no retry.",
      "fix": "Replace with a cause + action message and a Retry control."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"harden-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `category`: enum, one of `"async-state" | "loading-band" | "overflow" |
  "error-state" | "empty-state" | "i18n" | "responsive"`.
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: Async action missing failure UI **or** error message gives no
  cause and no corrective action **or** primary content scrolls
  horizontally on the smallest supported viewport.
- `warn`: Overflow not handled, empty state vague, units missing.
- `pass`: `changes` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable harden target=src/screens/Billing
```

Example output:

```json
{
  "schemaVersion": "harden-report-v1",
  "verdict": "fail",
  "changes": [
    {
      "category": "async-state",
      "ruleId": "harden-missing-failure-ui",
      "severity": "fail",
      "antiPatternId": null,
      "location": { "path": "src/screens/Billing/InvoiceForm.tsx", "line": 88 },
      "message": "Submit handler has no failure branch in the UI.",
      "fix": "Render an inline error with a Retry control on submit failure."
    }
  ]
}
```
