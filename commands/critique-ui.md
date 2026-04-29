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
severity_threshold: warn
---

# /impeccable critique

You are reviewing a UI against the Impeccable UI gate.

## Procedure
1. Read the target file(s).
2. Run the preflight checklist from `impeccable-ui`.
3. For each fail condition, cite the anti-pattern by id.
4. Output a structured report.

## Output (JSON, conforms to `critique-report-v1`)

```json
{
  "verdict": "pass | warn | fail",
  "findings": [
    {
      "rule": "ui-uniform-radius",
      "severity": "warn",
      "antiPattern": "uniform-radius",
      "where": "Card.tsx:12",
      "message": "Every container uses rounded-2xl.",
      "fix": "Use rounded-sharp on inner data tiles, keep rounded-panel only on outer wrapper."
    }
  ]
}
```

## Calibration
- Be ruthless about the "Generic SaaS card" anti-pattern. If you see soft radius +
  soft shadow + centered heading + single CTA, the verdict is `fail`.
- Do not propose patches in this command. Use `/impeccable rewrite-generic` for that.
