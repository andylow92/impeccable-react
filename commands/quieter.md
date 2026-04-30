---
id: quieter
title: Reduce visual intensity on an over-loud target
slug: /impeccable quieter
inputs:
  - name: target
    kind: path
    required: true
    description: The component, screen, or directory that is visually overloaded.
outputs:
  - kind: report
    schema: quieter-report-v1
uses_skills:
  - impeccable-ui
uses_references:
  - typography
  - color-contrast
  - motion-design
severity_threshold: warn
---

# /impeccable quieter

## Purpose
Resolve over-stimulating UIs: too many accents, too many elevations, too
many display-tier elements, too much motion. Restore one dominant signal
per viewport.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Count accent colors on screen. If more than one accent encodes the
   same semantic, collapse to one.
2. Count display-tier elements on screen. If more than one, demote all
   but the highest-priority to value tier.
3. Count elevated surfaces (shadow > 0). If more than one, flatten all
   but the highest-priority.
4. Count concurrent motion loops (shimmer, pulse, marquee). If more than
   one per surface, remove the redundant ones per `motion-design`.
5. Reduce decorative gradients to neutral surfaces unless they encode
   state per `color-contrast`.
6. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "quieter-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "ruleId": "quieter-multiple-displays",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Dashboard.tsx", "line": 22 },
      "message": "Three display-tier elements compete on the same viewport.",
      "fix": "Demote two of the three to value tier; keep only the primary metric at display tier."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"quieter-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: More than three competing accents on a single viewport with no
  semantic distinction.
- `warn`: Multiple display-tier elements, multiple elevated surfaces,
  decorative gradients, or concurrent motion loops.
- `pass`: `changes` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable quieter target=src/screens/Dashboard.tsx
```

Example output:

```json
{
  "schemaVersion": "quieter-report-v1",
  "verdict": "warn",
  "changes": [
    {
      "ruleId": "quieter-multiple-elevations",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Dashboard.tsx", "line": 8 },
      "message": "Five card surfaces share the same shadow; depth becomes meaningless.",
      "fix": "Flatten four of the five to surface-only and reserve elevation for the primary card."
    }
  ]
}
```
