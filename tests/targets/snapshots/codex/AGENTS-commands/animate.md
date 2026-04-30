# Audit and align motion against the motion-design reference

# /impeccable animate

## Purpose
Verify every transition and animation in the target encodes a state change,
sits inside the duration band, uses role-correct easing, and respects
reduced-motion.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Locate every `transition`, `animation`, `keyframes`, Framer Motion prop,
   and JS-driven motion call in the target.
2. For each, name the state change it explains. If none, mark for removal.
3. Check duration: 120–240ms for UI feedback, ≤ 400ms for page-scale.
4. Check easing role: out (enter), in (exit), in-out (reposition).
5. Confirm at most two animated properties per causal event.
6. Confirm staggers are deterministic and ≤ 30ms step on one axis.
7. Confirm a `prefers-reduced-motion: reduce` branch disables non-essential
   motion and limits the rest to ≤ 100ms opacity crossfades.
8. Confirm hover and `:focus-visible` produce identical state feedback.
9. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "animate-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "ruleId": "animate-overlong-duration",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/components/Card.tsx",
        "line": 27
      },
      "message": "Transition duration 600ms exceeds the 240ms UI feedback band.",
      "fix": "Reduce to duration-200 (200ms) and switch easing to ease-out."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"animate-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: A `prefers-reduced-motion` branch is missing entirely **or** hover
  state feedback is gated behind cursor-only events with no focus-visible
  parity.
- `warn`: Duration, easing, stagger, or concurrent-property issues remain.
- `pass`: `changes` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable animate target=src/components/Card.tsx
```

Example output:

```json
{
  "schemaVersion": "animate-report-v1",
  "verdict": "fail",
  "changes": [
    {
      "ruleId": "animate-no-reduced-motion",
      "severity": "fail",
      "antiPatternId": null,
      "location": {
        "path": "src/components/Card.tsx",
        "line": 1
      },
      "message": "No prefers-reduced-motion branch; non-essential motion will run for users who disabled it.",
      "fix": "Wrap non-essential transitions in @media (prefers-reduced-motion: reduce) and limit to <=100ms opacity crossfades."
    },
    {
      "ruleId": "animate-decorative-spring",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/components/Card.tsx",
        "line": 27
      },
      "message": "Elastic easing on hover scale + rotate has no causal source.",
      "fix": "Replace with background-color + box-shadow transitions at 160ms ease-out."
    }
  ]
}
```
