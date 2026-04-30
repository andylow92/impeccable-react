---
description: Run the full critique-polish-fix workflow against a target
---
# /impeccable craft

## Purpose
Run the full Impeccable workflow end-to-end on a target: critique generic
patterns, then polish residual drift, then dispatch the relevant per-reference
fixers (`animate`, `layout`, `typeset`, `clarify`, `adapt`). Returns a
single combined report.

## Inputs
- `target` (required, `path`): component, screen, or directory.
- `focus` (optional, `string`): comma-separated subset of
  `typography,color,spacing,motion,interaction,responsive,writing`. When
  omitted, all dimensions run.

## Procedure
1. Run the `critique-ui` procedure; collect findings.
2. Run the `polish` procedure; collect changes and residue.
3. For each dimension in `focus` (or all dimensions when omitted), dispatch
   the corresponding fixer (`typeset`, `colorize` via `color-contrast`,
   `layout`, `animate`, `interaction-design` checks via `polish`, `adapt`,
   `clarify`) and merge results.
4. Deduplicate findings that fire from multiple fixers on the same
   `path:line:ruleId` triple, preferring the highest severity.
5. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "craft-report-v1",
  "verdict": "pass",
  "stages": {
    "critique": [],
    "polish": [],
    "fixers": []
  }
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"craft-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `stages`: object; all three keys required (`critique`, `polish`, `fixers`),
  each an array (use `[]` when none).
- Every entry inside any stage uses the standard finding shape
  (`ruleId`, `severity`, `antiPatternId`, `location`, `message`, `fix`).

## Severity rubric
- `fail`: any stage entry has `severity: "fail"`.
- `warn`: no `fail` entries; at least one `warn` entry exists.
- `pass`: every stage array is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable craft target=src/screens/Billing focus=typography,motion
```

Example output:

```json
{
  "schemaVersion": "craft-report-v1",
  "verdict": "warn",
  "stages": {
    "critique": [],
    "polish": [],
    "fixers": [
      {
        "ruleId": "animate-overlong-duration",
        "severity": "warn",
        "antiPatternId": null,
        "location": { "path": "src/screens/Billing/Card.tsx", "line": 27 },
        "message": "Transition duration 600ms exceeds the 240ms UI feedback band.",
        "fix": "Reduce to duration-200 (200ms)."
      }
    ]
  }
}
```
