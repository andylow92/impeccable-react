---
id: layout
title: Audit and align spacing against the spatial-design reference
slug: /impeccable layout
inputs:
  - name: target
    kind: path
    required: true
    description: The component, screen, or directory to audit for spacing.
outputs:
  - kind: report
    schema: layout-report-v1
uses_skills:
  - impeccable-ui
uses_references:
  - spatial-design
severity_threshold: warn
---

# /impeccable layout

## Purpose
Verify spacing values come from the documented scale, proximity carries
grouping, and section separation exceeds intra-section gaps.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Inventory every spacing value in the target (`p-*`, `m-*`, `gap-*`,
   inline styles, magic px). Read `DESIGN.md` if present to anchor the
   scale; otherwise treat the dominant repeating values as the scale.
2. Flag every spacing value that is not on the scale.
3. For each grouping container, confirm outer padding ≥ inner row gap +
   one step. Otherwise flag a flat-stack issue.
4. For each pair of sibling sections, confirm inter-section gap exceeds
   each side's intra-section gap. Otherwise flag a separation issue.
5. Verify hit targets ≥ 44×44 on touch surfaces and ≥ 24×24 on pointer
   surfaces, achieved via padding rather than fixed dimensions.
6. Flag grouping that depends solely on shadow/border when proximity could
   express it.
7. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "layout-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "ruleId": "layout-untokenized-spacing",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/components/Card.tsx",
        "line": 14
      },
      "message": "p-[13px] is not on the spacing scale.",
      "fix": "Replace with p-3 (12px)."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"layout-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: Touch hit targets fall below 44×44 **or** primary content requires
  horizontal scrolling on the supported viewport range.
- `warn`: Untokenized values, flat-stack containers, weak inter-section
  separation, or grouping carried by border/shadow alone.
- `pass`: `changes` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable layout target=src/components/Card.tsx
```

Example output:

```json
{
  "schemaVersion": "layout-report-v1",
  "verdict": "warn",
  "changes": [
    {
      "ruleId": "layout-flat-stack",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/components/Card.tsx",
        "line": 8
      },
      "message": "Outer padding (12px) equals inner row gap (12px); section reads as a flat stack.",
      "fix": "Increase outer padding to p-6 (24px) so the container frames its rows."
    }
  ]
}
```
