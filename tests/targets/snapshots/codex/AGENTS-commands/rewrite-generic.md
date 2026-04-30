# Rewrite a generic UI using the strip → rank → tier protocol

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
  "schemaVersion": "rewrite-patch-v2",
  "type": "patch",
  "target": {
    "path": "src/components/Card.tsx",
    "context": "rewrite-generic"
  },
  "summary": "Rewrite applied with strip-rank-tier protocol.",
  "patch": {
    "format": "unified_diff",
    "content": "diff --git a/src/components/Card.tsx b/src/components/Card.tsx\n..."
  },
  "rules": {
    "noExtraCommentary": true
  }
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"rewrite-patch-v2"`.
- `type`: enum, must be either `"patch"` or `"full_replacement"`.
- `target.path`: required string path exactly matching the input `target`.
- `target.context`: required string, must be `"rewrite-generic"`.
- `summary`: required non-empty string.
- `rules.noExtraCommentary`: required boolean and must be `true`.
- If `type == "patch"`:
  - `patch.format`: required enum, must be `"unified_diff"`.
  - `patch.content`: required non-empty unified diff string.
- If `type == "full_replacement"`:
  - `replacement.format`: required enum, must be `"full_file"`.
  - `replacement.content`: required full post-rewrite file contents as UTF-8 text.
  - Deterministic handling is required: the full replacement must be exactly what would result after applying the equivalent strip → rank → tier rewrite with no extra metadata, no alternate formatting variants, and a trailing newline.

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
  "schemaVersion": "rewrite-patch-v2",
  "type": "patch",
  "target": {
    "path": "src/components/Card.tsx",
    "context": "rewrite-generic"
  },
  "summary": "Demoted decorative styles, established hierarchy, and constrained accent usage.",
  "patch": {
    "format": "unified_diff",
    "content": "diff --git a/src/components/Card.tsx b/src/components/Card.tsx\nindex 1111111..2222222 100644\n--- a/src/components/Card.tsx\n+++ b/src/components/Card.tsx\n@@ -1,4 +1,4 @@\n-...\n+...\n"
  },
  "rules": {
    "noExtraCommentary": true
  }
}
```
