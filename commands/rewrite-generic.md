---
id: rewrite-generic
title: Rewrite a generic UI using the strip → rank → tier protocol
slug: /impeccable rewrite-generic
inputs:
  - name: target
    kind: path
    required: true
    description: The component file to rewrite.
outputs:
  - kind: patch
    schema: rewrite-patch-v1
uses_skills:
  - impeccable-ui
uses_references:
  - anti-pattern-library
severity_threshold: fail
---

# /impeccable rewrite-generic

## Purpose
Replace a UI that fails the Impeccable gate by rewriting it with the strip → rank → tier protocol.

## Inputs
- `target` (required, `path`): component file to rewrite.

## Procedure
1. **Strip**: remove shadows, gradients, rounded corners, and pills; reduce to monochrome blocks.
2. **Rank**: identify one highest-priority element; rank all remaining elements or remove them.
3. **Tier typography**: enforce exactly three tiers: micro-label → value → display heading.
4. **Reintroduce contrast**: apply a single accent color only to the highest-priority element and its action.
5. **Reintroduce shape**: keep data surfaces sharp; allow soft radius only on the outer panel.
6. **Reintroduce shadow**: allow at most one elevated surface per screen.
7. Produce a deterministic patch payload conforming to the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "rewrite-patch-v1",
  "mode": "unified_diff",
  "target": "src/components/Card.tsx",
  "summary": "Rewrite applied with strip-rank-tier protocol.",
  "diff": "diff --git a/src/components/Card.tsx b/src/components/Card.tsx\n...",
  "requiresFullReplacement": false
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"rewrite-patch-v1"`.
- `mode`: enum, one of `"unified_diff" | "full_replacement"`.
- `target`: string path exactly matching the input target.
- `summary`: non-empty string.
- `diff`: required string; for `full_replacement`, include full file content in patch form.
- `requiresFullReplacement`: boolean, must match `mode` (`true` iff `mode == "full_replacement"`).

## Severity rubric
- `fail`: Original UI fails gate; rewrite is mandatory.
- `warn`: Rewrite is partial but still leaves non-blocking generic traits.
- `pass`: Rewrite removes gate-failing generic patterns.

## Example invocation + example output
Invocation:

```text
/impeccable rewrite-generic target=src/components/Card.tsx
```

Example output:

```json
{
  "schemaVersion": "rewrite-patch-v1",
  "mode": "unified_diff",
  "target": "src/components/Card.tsx",
  "summary": "Demoted decorative styles, established hierarchy, and constrained accent usage.",
  "diff": "diff --git a/src/components/Card.tsx b/src/components/Card.tsx\nindex 1111111..2222222 100644\n--- a/src/components/Card.tsx\n+++ b/src/components/Card.tsx\n@@ -1,4 +1,4 @@\n-...\n+...\n",
  "requiresFullReplacement": false
}
```
