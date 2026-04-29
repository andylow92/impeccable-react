---
id: polish
title: Final-pass alignment against the design system before ship
slug: /impeccable polish
inputs:
  - name: target
    kind: path
    required: true
    description: The component, screen, or directory to polish.
outputs:
  - kind: report
    schema: polish-report-v1
uses_skills:
  - impeccable-ui
uses_references:
  - typography
  - color-contrast
  - spatial-design
  - motion-design
  - interaction-design
severity_threshold: warn
---

# /impeccable polish

## Purpose
Resolve the residue that survives `critique` and `rewrite-generic`: token
drift, hierarchy slips, and unfinished states. Polish never introduces
features — it only aligns the target with the design contract recorded in
`DESIGN.md` and the referenced rules.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Read `DESIGN.md` if present; treat its tokens as authoritative. If absent,
   treat the dominant tokens in `target` as the authority for this run.
2. Token alignment pass:
   - Replace untokenized spacing, color, radius, and shadow values with the
     nearest token, per `spatial-design` and `color-contrast`.
3. Hierarchy alignment pass:
   - Ensure three type tiers are present per `typography`.
   - Ensure the accent appears at most once per viewport on the primary
     action per `color-contrast`.
4. State completeness pass:
   - Verify default / hover / focus-visible / active / disabled per
     `interaction-design`.
   - Verify pending / success / failure states for every async action.
5. Motion pass:
   - Verify durations sit in 120–240ms (UI) and ≤ 400ms (page) per
     `motion-design`.
   - Verify a `prefers-reduced-motion` branch exists.
6. Emit JSON that exactly matches the output schema. Each `change` is a
   minimal patch description, not a rewrite.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "polish-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "category": "token",
      "ruleId": "polish-untokenized-spacing",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/components/Card.tsx",
        "line": 14
      },
      "message": "p-[13px] is not on the spacing scale.",
      "fix": "Replace with p-3 (12px)."
    }
  ],
  "residue": [
    {
      "category": "hierarchy",
      "message": "Display tier is missing; cannot resolve without product input.",
      "ruleId": "polish-missing-display-tier",
      "antiPatternId": null
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"polish-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `residue`: required array of issues that polish cannot resolve mechanically
  (use `[]` when none).
- `category`: enum, one of `"token" | "hierarchy" | "state" | "motion"`.
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).
- `fix`: minimal patch description; never a multi-step rewrite. If a fix
  cannot be expressed as a single mechanical edit, move the item to
  `residue`.

## Severity rubric
- `fail`: At least one `change` has `severity: "fail"` (e.g. a contrast
  violation that polish cannot resolve without redesign) **or** a state from
  `interaction-design` is entirely absent (e.g. no focus-visible style).
- `warn`: All resolvable issues have `severity: "warn"`; at least one
  `change` exists.
- `pass`: `changes` is `[]` and `residue` is `[]`.

Calibration rule: A missing focus-visible style on any interactive element
classifies the entire run as `fail`, even if all other categories pass.

## Example invocation + example output
Invocation:

```text
/impeccable polish target=src/screens/Billing
```

Example output:

```json
{
  "schemaVersion": "polish-report-v1",
  "verdict": "warn",
  "changes": [
    {
      "category": "token",
      "ruleId": "polish-untokenized-spacing",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/screens/Billing/Card.tsx",
        "line": 14
      },
      "message": "p-[13px] is not on the spacing scale.",
      "fix": "Replace with p-3 (12px)."
    },
    {
      "category": "motion",
      "ruleId": "polish-overlong-duration",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/screens/Billing/Card.tsx",
        "line": 27
      },
      "message": "transition duration 600ms exceeds the 240ms UI feedback band.",
      "fix": "Reduce to duration-200 (200ms)."
    }
  ],
  "residue": []
}
```
