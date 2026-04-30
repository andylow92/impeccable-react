---
id: typeset
title: Audit and align type hierarchy against the typography reference
slug: /impeccable typeset
inputs:
  - name: target
    kind: path
    required: true
    description: The component, screen, or directory to audit for typography.
outputs:
  - kind: report
    schema: typeset-report-v1
uses_skills:
  - impeccable-ui
uses_references:
  - typography
severity_threshold: warn
---

# /impeccable typeset

## Purpose
Verify three type tiers exist, body/value text never falls below 14px, and
the value tier is visibly stronger than the label tier.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Inventory every text element in the target and assign each to label,
   value/body, or display tier.
2. Flag screens with fewer than three tiers or more than one display-size
   element per viewport.
3. Flag body/value text below 14px.
4. Flag tier collapse: label and value sharing the same size and weight.
5. Verify adjacent tier sizes step by ≥ 2px and ≤ 1.5×, except the single
   transition into the display tier.
6. Verify text alignment matches layout anchoring (no centered titles in
   left-anchored layouts).
7. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "typeset-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "ruleId": "typeset-collapsed-tiers",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/components/ProjectCard.tsx",
        "line": 12
      },
      "message": "Label and value share size 14px and weight 500.",
      "fix": "Drop label to 12px uppercase tracked-wide; raise value to semibold."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"typeset-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: Body/value text below 14px **or** more than one display-size
  element per viewport.
- `warn`: Fewer than three tiers, collapsed label/value styling, or rhythm
  jumps outside the 2px / 1.5× window.
- `pass`: `changes` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable typeset target=src/components/ProjectCard.tsx
```

Example output:

```json
{
  "schemaVersion": "typeset-report-v1",
  "verdict": "fail",
  "changes": [
    {
      "ruleId": "typeset-sub-floor-body",
      "severity": "fail",
      "antiPatternId": null,
      "location": {
        "path": "src/components/ProjectCard.tsx",
        "line": 18
      },
      "message": "Value text rendered at 12px violates the 14px floor.",
      "fix": "Raise value text to 14px and reserve 12px for the label tier."
    }
  ]
}
```
