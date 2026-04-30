# Audit a TypeScript file or directory against the impeccable-typescript skill

# /impeccable audit-typescript

## Purpose
Audit TypeScript targets against hard rules and produce deterministic, parseable findings.

## Inputs
- `target` (required, `path`): `.ts`/`.tsx` file or directory.

## Procedure
1. Detect forbidden `any` usage (`: any`, `as any`, `<any>`, `any[]`); record each as `fail`.
2. Detect `await fetch(...)` or `JSON.parse(...)` results not validated through `.parse(...)` in the same expression; record each as `warn`.
3. Detect exported functions with inferred return types; record each as `warn`.
4. Detect local type literals that duplicate a domain type from `src/domain/*`; record each as `fail`.
5. Compute verdict from findings.
6. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "audit-report-v1",
  "verdict": "pass",
  "findings": [
    {
      "ruleId": "ts-no-any",
      "severity": "fail",
      "location": {
        "path": "src/lib/api.ts",
        "line": 14
      },
      "snippet": "function load(data: any) {",
      "message": "Forbidden any usage.",
      "fix": "Replace any with a concrete type or unknown + parser."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"audit-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `findings`: required array (use `[]` when none).
- `severity`: enum, one of `"warn" | "fail"`.
- Every finding must include all keys shown above.
- `location.line`: integer (1-based).

## Severity rubric
- `fail`: One or more `fail` findings exist.
- `warn`: No `fail` findings and at least one `warn` finding exists.
- `pass`: `findings` is empty.

## Example invocation + example output
Invocation:

```text
/impeccable audit-typescript target=src/lib
```

Example output:

```json
{
  "schemaVersion": "audit-report-v1",
  "verdict": "fail",
  "findings": [
    {
      "ruleId": "ts-no-any",
      "severity": "fail",
      "location": {
        "path": "src/lib/api.ts",
        "line": 14
      },
      "snippet": "function load(data: any) {",
      "message": "Forbidden any usage.",
      "fix": "Replace any with validated input types."
    }
  ]
}
```
