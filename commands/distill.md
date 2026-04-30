---
id: distill
title: Strip a target down to elements that change a decision
slug: /impeccable distill
inputs:
  - name: target
    kind: path
    required: true
    description: The component, screen, or directory to distill.
outputs:
  - kind: report
    schema: distill-report-v1
uses_skills:
  - impeccable-ui
uses_references:
  - typography
  - spatial-design
  - ux-writing
severity_threshold: warn
---

# /impeccable distill

## Purpose
Remove every element that does not change a decision the user makes.
Decoration, filler charts, sparklines, and chrome get cut. What remains
must justify itself.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Inventory every element on screen. For each, name the user decision
   it supports. If you cannot, mark for removal.
2. Flag filler dashboards: charts, sparklines, badges, or pills whose
   value cannot be tied to a decision.
3. Flag decorative imagery, icons, or illustrations that do not
   communicate state, role, or wayfinding.
4. Flag duplicate information (same metric expressed twice).
5. Flag explanatory copy that restates the visible label per
   `ux-writing`.
6. Reclaim the freed space per `spatial-design` (increase rhythm around
   what remains).
7. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "distill-report-v1",
  "verdict": "pass",
  "removals": [
    {
      "ruleId": "distill-filler-sparkline",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Dashboard.tsx", "line": 34 },
      "message": "30-day sparkline cannot be tied to any user decision on this screen.",
      "fix": "Remove the sparkline; reclaim the space as breathing room around the primary metric."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"distill-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `removals`: required array (use `[]` when none).
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).
- `fix`: must describe a removal — never an addition or restyle.

## Severity rubric
- `fail`: More than half of the screen's surface area cannot be tied to a
  decision.
- `warn`: At least one element cannot be tied to a decision.
- `pass`: `removals` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable distill target=src/screens/Dashboard.tsx
```

Example output:

```json
{
  "schemaVersion": "distill-report-v1",
  "verdict": "warn",
  "removals": [
    {
      "ruleId": "distill-restated-label",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Dashboard.tsx", "line": 12 },
      "message": "Tooltip on \"Save\" repeats the visible label (\"Saves the project\").",
      "fix": "Remove the tooltip; the label is already clear."
    }
  ]
}
```
