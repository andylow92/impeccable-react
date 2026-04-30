# Audit a target for layout-shift, paint cost, and request waterfall issues

# /impeccable optimize

## Purpose
Surface the runtime cost issues that ship-blocking design correctness
already implies: cumulative layout shift, paint-heavy transitions, and
component-level fetch fan-out that violates layer boundaries.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Audit images, video, and embeds for `aspect-ratio` (or width/height)
   per `responsive-design`. Missing declarations cause CLS on load.
2. Audit transitions for paint-heavy properties (box-shadow on every
   frame, filter on hover) per `motion-design`. Recommend transform /
   opacity instead.
3. Audit fonts for `font-display: swap` and explicit fallback metrics.
   Missing settings cause FOIT or layout shift on load.
4. Audit components for direct `fetch` calls (boundary violation per
   `impeccable-react`). Each is a request waterfall risk because it
   defeats screen-level orchestration.
5. Audit list rendering for keyed reconciliation; flag missing or
   index-based keys on dynamic lists.
6. Audit `useEffect` for derived-state patterns that re-render twice;
   recommend computing during render.
7. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "optimize-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "category": "cls",
      "ruleId": "optimize-missing-aspect-ratio",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/components/Avatar.tsx", "line": 6 },
      "message": "Image has no width/height or aspect-ratio; layout will shift on load.",
      "fix": "Add width/height attributes or aspect-ratio: 1 / 1."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"optimize-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `category`: enum, one of `"cls" | "paint" | "fonts" | "fetch" | "lists"
  | "derived-state"`.
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: A component calls `fetch` or a raw API client directly (boundary
  violation that produces request waterfalls) **or** a transition animates
  paint-heavy properties (box-shadow, filter) on every frame on a
  high-traffic surface.
- `warn`: Missing aspect-ratio, missing font-display, missing list keys,
  or derived state computed in `useEffect`.
- `pass`: `changes` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable optimize target=src/screens/Billing
```

Example output:

```json
{
  "schemaVersion": "optimize-report-v1",
  "verdict": "fail",
  "changes": [
    {
      "category": "fetch",
      "ruleId": "optimize-component-level-fetch",
      "severity": "fail",
      "antiPatternId": null,
      "location": { "path": "src/screens/Billing/Card.tsx", "line": 8 },
      "message": "Component calls fetch directly; defeats screen-level orchestration and creates a request waterfall.",
      "fix": "Move the call into a typed lib/ hook and pass data down as props."
    }
  ]
}
```
