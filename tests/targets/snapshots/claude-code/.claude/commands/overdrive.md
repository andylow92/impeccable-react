---
description: Apply technically sophisticated effects only where they earn their cost
---
# /impeccable overdrive

## Purpose
Approve or reject candidates for technically sophisticated effects
(parallax, view-transitions, FLIP animations, scroll-driven motion,
shaders). Each approved effect must serve continuity, causality, or
state, never spectacle.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Inventory candidates currently applied or proposed (parallax, scroll-
   driven motion, view-transitions, FLIP, shaders, magnification).
2. For each, identify the function it serves: continuity, causality,
   wayfinding, depth-as-state. Reject candidates with no function.
3. Verify each survives `prefers-reduced-motion` per `motion-design`
   (the effect either disables fully or degrades to a static state).
4. Verify each meets contrast and accessibility per `color-contrast`
   even when the effect is inactive (no information lives only inside
   the effect).
5. Verify each can be paused or skipped via keyboard.
6. Verify the cost is justified: no full-page parallax that costs paint
   on every scroll without serving wayfinding.
7. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "overdrive-report-v1",
  "verdict": "pass",
  "decisions": [
    {
      "effect": "view-transition",
      "function": "continuity",
      "ruleId": "overdrive-justified",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Billing/Detail.tsx", "line": 4 },
      "approve": true,
      "rationale": "Maintains spatial continuity between list and detail; survives reduced-motion via crossfade fallback."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"overdrive-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `decisions`: required array (use `[]` when none).
- `effect`: required non-empty string naming the technique.
- `function`: enum, one of `"continuity" | "causality" | "wayfinding" |
  "depth-as-state" | "spectacle"`.
- `approve`: required boolean. Must be `false` when `function ==
  "spectacle"`.
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: A spectacle-only effect is currently applied **or** an effect
  hides information that is not available without it.
- `warn`: An approved effect lacks a reduced-motion fallback or a
  keyboard pause/skip control.
- `pass`: `decisions` contains only approved entries with full fallback
  coverage, or `decisions` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable overdrive target=src/screens/Billing/Detail.tsx
```

Example output:

```json
{
  "schemaVersion": "overdrive-report-v1",
  "verdict": "warn",
  "decisions": [
    {
      "effect": "scroll-driven-parallax",
      "function": "spectacle",
      "ruleId": "overdrive-rejected-spectacle",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Billing/Detail.tsx", "line": 14 },
      "approve": false,
      "rationale": "Parallax serves no continuity or wayfinding here; remove it."
    }
  ]
}
```
