# Run the full pre-ship gate before merging UI changes

# /impeccable pre-ship-gate

## Purpose
Execute the full pre-ship quality gate and return a merge decision that can block release.

## Inputs
- `target` (required, `path`): component, screen, or directory under review.

## Procedure
1. Run the `impeccable-ui` preflight checklist; each unchecked hard item is a blocker.
2. Run `impeccable-react` layer-boundary checks; each violation is a blocker.
3. Run `impeccable-typescript` hard-rule checks; each `any`, unparsed external data path, or duplicated domain type is a blocker.
4. Cross-reference findings with the anti-pattern library and attach matching ids.
5. Produce final verdict strictly from blocker presence.
6. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "gate-report-v1",
  "verdict": "pass",
  "blockers": [
    {
      "ruleId": "ui-generic-saas-card",
      "source": "impeccable-ui",
      "antiPatternId": "generic-saas-card",
      "location": {
        "path": "src/components/Card.tsx",
        "line": 11
      },
      "message": "Generic SaaS card pattern detected.",
      "fix": "Rewrite using strip → rank → tier protocol."
    }
  ],
  "warnings": [
    {
      "ruleId": "ts-explicit-return-type",
      "source": "impeccable-typescript",
      "antiPatternId": null,
      "location": {
        "path": "src/lib/math.ts",
        "line": 20
      },
      "message": "Exported function has inferred return type.",
      "fix": "Add explicit return type annotation."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"gate-report-v1"`.
- `verdict`: enum, one of `"pass" | "fail"`.
- `blockers`: required array (use `[]` when none).
- `warnings`: required array (use `[]` when none).
- `source`: enum, one of `"impeccable-ui" | "impeccable-react" | "impeccable-typescript"`.
- `antiPatternId`: always present on each finding item; type is `string | null` (`null` when not applicable; never omit).
- Every item must include `ruleId`, `location.path`, `location.line`, `message`, and `fix`.
- Preserve key ordering exactly as shown (`ruleId`, `source`, `antiPatternId`, `location`, `message`, `fix`) for deterministic CI consumption.
- Output must be strict, parseable JSON only (no markdown wrappers, comments, trailing commas, or extra top-level keys).

## Severity rubric
- `fail`: One or more `blockers` entries exist.
- `pass`: `blockers` is empty.
- Warnings never override blocker logic.

## Example invocation + example output
Invocation:

```text
/impeccable pre-ship-gate target=src/screens/Billing
```

Example output:

```json
{
  "schemaVersion": "gate-report-v1",
  "verdict": "fail",
  "blockers": [
    {
      "ruleId": "ui-generic-saas-card",
      "source": "impeccable-ui",
      "antiPatternId": "generic-saas-card",
      "location": {
        "path": "src/screens/Billing/Card.tsx",
        "line": 11
      },
      "message": "Generic SaaS card pattern detected.",
      "fix": "Replace decorative hierarchy with ranked information hierarchy."
    }
  ],
  "warnings": []
}
```
