---
id: document
title: Generate DESIGN.md from the current codebase
slug: /impeccable document
inputs:
  - name: target
    kind: path
    required: false
    description: The repository root or app directory. Defaults to CWD.
outputs:
  - kind: report
    schema: document-report-v1
uses_skills:
  - impeccable-ui
uses_references:
  - typography
  - color-contrast
  - spatial-design
severity_threshold: warn
---

# /impeccable document

## Purpose
Generate `DESIGN.md` from the existing codebase without inferring product
context. Use this when `PRODUCT.md` already exists or is intentionally out of
scope; otherwise prefer `/impeccable teach`.

## Inputs
- `target` (optional, `path`): repo root or app directory. Defaults to CWD.

## Procedure
1. Walk `target`. Read Tailwind config, CSS custom properties, and
   token modules to extract spacing, color, radius, shadow, type scale, and
   motion durations.
2. Identify the dominant accent token and verify it encodes a state per the
   `color-contrast` reference. Record the semantic mapping.
3. Identify the type tier set per the `typography` reference. Record sizes,
   weights, and color tokens for label / value / display.
4. Identify the spacing scale per the `spatial-design` reference. Record
   the canonical step set.
5. Draft `DESIGN.md` as one `actions[]` write entry. Do not draft
   `PRODUCT.md`.
6. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "document-report-v1",
  "verdict": "pass",
  "summary": {
    "primaryAccent": "cobalt",
    "spacingScale": [4, 8, 12, 16, 24, 32, 48, 64],
    "typeTiers": ["label", "value", "display"]
  },
  "actions": [
    {
      "kind": "write",
      "path": "DESIGN.md",
      "contents": "# Design system\n..."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"document-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `summary`: object; all three keys required (use `null` if a value cannot be
  inferred — never omit).
- `actions`: required array; exactly one entry whose `path` is `"DESIGN.md"`.

## Severity rubric
- `fail`: A primary signal (accent, tiers, or spacing) cannot be resolved at
  all.
- `warn`: All signals resolve but at least one is weak.
- `pass`: All three summary keys resolved with confidence.

## Example invocation + example output
Invocation:

```text
/impeccable document target=.
```

Example output:

```json
{
  "schemaVersion": "document-report-v1",
  "verdict": "pass",
  "summary": {
    "primaryAccent": "cobalt",
    "spacingScale": [4, 8, 12, 16, 24, 32],
    "typeTiers": ["label", "value", "display"]
  },
  "actions": [
    {
      "kind": "write",
      "path": "DESIGN.md",
      "contents": "# Design system\n\n## Type tiers\n- label: 12px, uppercase, muted\n- value: 14px, semibold, ink\n- display: 28px, bold, ink (one per viewport)\n\n## Accent\n- cobalt: action; reserved for the primary CTA.\n\n## Spacing scale\n4 / 8 / 12 / 16 / 24 / 32\n"
    }
  ]
}
```
