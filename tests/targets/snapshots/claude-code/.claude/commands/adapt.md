---
description: Audit and align responsive behavior against the responsive-design reference
---
# /impeccable adapt

## Purpose
Verify the target builds mobile-first, breakpoints serve content rules,
type stays fluid above the 14px floor, and primary content never requires
horizontal scrolling.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Inventory every media query and container query in the target.
2. Flag desktop-first cascades that use `max-width` queries to "fix" mobile.
3. For each breakpoint, confirm a content rule exists (in `DESIGN.md` or
   inline comment). Flag breakpoints that map to device classes only.
4. Flag fixed body/value font sizes; require fluid sizing (`clamp()` style)
   bounded by the 14px floor.
5. Flag tap targets that shrink below 44×44 in compact density.
6. Flag primary content that requires horizontal scrolling outside of
   announced lists/tables.
7. Flag images and embeds that do not declare `aspect-ratio` or width/height.
8. Flag viewport-only breakpoints used on components that ship into multiple
   layout contexts (recommend container queries instead).
9. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "adapt-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "ruleId": "adapt-desktop-first-cascade",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/styles/card.css",
        "line": 1
      },
      "message": "Stylesheet uses max-width media queries to shrink for mobile.",
      "fix": "Invert the cascade: write base styles for the smallest viewport and add density via min-width queries."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"adapt-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: Tap targets below 44×44 on touch density **or** primary content
  requires horizontal scroll on the supported viewport range **or** body/value
  text falls below the 14px floor at any breakpoint.
- `warn`: Desktop-first cascades, undocumented breakpoints, fixed type sizes,
  missing aspect-ratio declarations, or viewport queries on reusable
  components.
- `pass`: `changes` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable adapt target=src/components/Card.tsx
```

Example output:

```json
{
  "schemaVersion": "adapt-report-v1",
  "verdict": "fail",
  "changes": [
    {
      "ruleId": "adapt-sub-floor-mobile",
      "severity": "fail",
      "antiPatternId": null,
      "location": {
        "path": "src/styles/card.css",
        "line": 9
      },
      "message": "@media (max-width: 768px) sets body text to 12px, below the 14px floor.",
      "fix": "Replace with clamp(0.875rem, 1.5vw, 1rem) at the base level and remove the desktop-first override."
    }
  ]
}
```
