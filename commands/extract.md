---
id: extract
title: Extract reusable components and tokens from a screen
slug: /impeccable extract
inputs:
  - name: target
    kind: path
    required: true
    description: The screen or component file to extract from.
outputs:
  - kind: report
    schema: extract-report-v1
uses_skills:
  - impeccable-ui
  - impeccable-react
uses_references:
  - typography
  - color-contrast
  - spatial-design
severity_threshold: warn
---

# /impeccable extract

## Purpose
Identify components and tokens inside a target that should be lifted into
shared modules, and emit a plan with concrete extraction targets — not a
patch. Code edits are out of scope; this command produces guidance.

## Inputs
- `target` (required, `path`): screen or component file.

## Procedure
1. Walk the target's JSX. Identify subtrees that:
   - Repeat (≥ 2 occurrences with shape parity).
   - Embody a named design pattern (header, metric tile, status pill).
   - Cross the layer boundary (per `impeccable-react`): a presentational
     subtree currently mixed with screen orchestration.
2. For each candidate, propose a name (PascalCase), a destination path under
   `src/ui/`, and a prop signature.
3. Walk inline values (color, spacing, radius, shadow, font). Identify
   literals that recur ≥ 3 times and propose a token name + destination.
4. Flag duplicate domain types declared inline in the UI; recommend a move
   to `src/domain/`.
5. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "extract-report-v1",
  "verdict": "pass",
  "components": [
    {
      "name": "MetricTile",
      "path": "src/ui/MetricTile.tsx",
      "propsSignature": "{ label: string; value: string; trend?: 'up' | 'down' }",
      "occurrences": [
        { "path": "src/screens/Billing/Card.tsx", "line": 22 },
        { "path": "src/screens/Billing/Card.tsx", "line": 38 }
      ],
      "rationale": "Pattern repeats with parity; lifts presentational subtree out of screen."
    }
  ],
  "tokens": [
    {
      "name": "spacing.gutter",
      "value": "16px",
      "occurrences": [
        { "path": "src/screens/Billing/Card.tsx", "line": 10 }
      ],
      "rationale": "Repeats 5x as the layout gutter; codify in DESIGN.md."
    }
  ],
  "domainMoves": []
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"extract-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `components`, `tokens`, `domainMoves`: required arrays (use `[]` when
  none).
- Each component entry must include all keys shown.
- `occurrences[].line`: integer (1-based).

## Severity rubric
- `fail`: A domain type is declared inline in the UI layer (boundary
  violation).
- `warn`: At least one extraction candidate exists.
- `pass`: All three arrays are `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable extract target=src/screens/Billing/Card.tsx
```

Example output:

```json
{
  "schemaVersion": "extract-report-v1",
  "verdict": "warn",
  "components": [
    {
      "name": "MetricTile",
      "path": "src/ui/MetricTile.tsx",
      "propsSignature": "{ label: string; value: string }",
      "occurrences": [
        { "path": "src/screens/Billing/Card.tsx", "line": 22 },
        { "path": "src/screens/Billing/Card.tsx", "line": 38 }
      ],
      "rationale": "Repeats 2x with prop parity."
    }
  ],
  "tokens": [],
  "domainMoves": []
}
```
