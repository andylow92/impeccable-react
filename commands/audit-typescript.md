---
id: audit-typescript
title: Audit a TypeScript file or directory against the impeccable-typescript skill
slug: /impeccable audit-typescript
inputs:
  - name: target
    kind: path
    required: true
    description: A .ts/.tsx file or directory to audit.
outputs:
  - kind: report
    schema: audit-report-v1
uses_skills:
  - impeccable-typescript
severity_threshold: fail
---

# /impeccable audit-typescript

You are auditing a TypeScript file against the hard rules in
`impeccable-typescript`.

## Procedure
1. Search for any of: `: any`, `as any`, `<any>`, `any[]`. Each occurrence is
   a `fail`.
2. Search for `await fetch(...)` or `JSON.parse(...)` not followed by a
   `.parse(` call within the same expression. Each occurrence is a `warn`.
3. Search for exported functions whose return type is inferred. Each is a
   `warn`.
4. Search for type literals that re-declare a domain type already exported
   from `src/domain/*`. Each is a `fail`.

## Output (JSON, conforms to `audit-report-v1`)

```json
{
  "verdict": "pass | warn | fail",
  "findings": [
    { "rule": "ts-no-any", "severity": "fail", "where": "lib/api.ts:14", "snippet": "function load(data: any) {", "fix": "..." }
  ]
}
```

Do not propose patches in this command. Use a follow-up command for that.
