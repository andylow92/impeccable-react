---
id: critique-ui
title: Critique a UI for generic patterns
slug: /impeccable critique
inputs:
  - name: target
    kind: path
    required: true
    description: The component file or directory to critique.
outputs:
  - kind: report
    schema: critique-report-v1
uses_skills:
  - impeccable-ui
uses_references:
  - typography
  - color-contrast
  - anti-pattern-library
severity_threshold: warn
---

# /impeccable critique

## Purpose
Review a UI target against the Impeccable UI gate and identify generic-pattern failures with machine-parseable findings.

## Inputs
- `target` (required, `path`): file or directory to review.

## Procedure
1. Read every file under `target` that contributes to the rendered UI.
2. Run the preflight checklist from `impeccable-ui`.
3. Cross-check against referenced anti-patterns; when matched, include the anti-pattern id.
4. Assign severity per the rubric below and compute the overall verdict.
5. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "critique-report-v1",
  "verdict": "pass",
  "findings": [
    {
      "ruleId": "ui-uniform-radius",
      "severity": "warn",
      "antiPatternId": "uniform-radius",
      "location": {
        "path": "src/components/Card.tsx",
        "line": 12
      },
      "message": "Every container uses rounded-2xl.",
      "fix": "Use rounded-sharp on inner data tiles; keep rounded-panel only on the outer wrapper."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"critique-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `findings`: required array (use `[]` when none).
- Each finding object must include all keys shown above.
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null` when no anti-pattern matches.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: Clear gate violation that materially preserves or introduces a known generic anti-pattern.
- `warn`: Meaningful weakness that should be corrected but is not a hard stop.
- `pass`: No findings.

Calibration rule: If the UI exhibits soft radius + soft shadow + centered heading + single CTA in a generic SaaS card pattern, classify at least one finding as `fail` and set `verdict` to `fail`.

## Example invocation + example output
Invocation:

```text
/impeccable critique target=src/components/Card.tsx
```

Example output:

```json
{
  "schemaVersion": "critique-report-v1",
  "verdict": "fail",
  "findings": [
    {
      "ruleId": "ui-generic-saas-card",
      "severity": "fail",
      "antiPatternId": "generic-saas-card",
      "location": {
        "path": "src/components/Card.tsx",
        "line": 12
      },
      "message": "Soft radius + soft shadow + centered heading + single CTA produces a generic SaaS card.",
      "fix": "Apply strip → rank → tier and reintroduce only one accent plus one elevated surface."
    }
  ]
}
```
