---
description: One-time setup that captures product context and design tokens
---
# /impeccable teach

## Purpose
Bootstrap the design contract. Learn the product, infer or capture the visual
system, and emit a planning report whose `actions` block writes `PRODUCT.md`
and `DESIGN.md` into the repo so subsequent commands have explicit context to
align against.

## Inputs
- `target` (optional, `path`): repo root or app directory. Defaults to CWD.

## Procedure
1. Walk `target` and collect signals:
   - `package.json`, `README.md`, top-level routes, screen filenames.
   - The most-imported components and the props they expose.
   - Spacing, color, radius, shadow, and font tokens (Tailwind config, CSS
     custom properties, design-token files, or the most-repeated literals).
2. Identify the product entity (e.g. "projects", "invoices", "incidents") by
   the dominant noun across routes, schemas, and component names.
3. Identify the dominant accent color and verify it encodes a state per the
   `color-contrast` reference. Mark unresolved accents as findings.
4. Identify the type tier set per the `typography` reference. If fewer than
   three tiers are detectable, mark as a finding.
5. Identify the spacing scale per the `spatial-design` reference. If
   spacing is untokenized (frequent magic px values), mark as a finding.
6. Draft two files as `actions[]` patches the harness will write:
   - `PRODUCT.md` — product noun, primary user, top three jobs-to-be-done,
     critical-path screens.
   - `DESIGN.md` — type tiers, accent semantics, spacing scale, radius roles,
     elevation levels, motion durations, banned patterns.
7. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "teach-report-v1",
  "verdict": "pass",
  "summary": {
    "productNoun": "project",
    "primaryAccent": "cobalt",
    "spacingScale": [4, 8, 12, 16, 24, 32, 48, 64],
    "typeTiers": ["label", "value", "display"]
  },
  "findings": [
    {
      "ruleId": "teach-untokenized-spacing",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/components/Card.tsx",
        "line": 12
      },
      "message": "11 magic spacing values detected; spacing scale is undefined.",
      "fix": "Codify a 4/8/12/16/24/32/48/64 scale in DESIGN.md and replace literals."
    }
  ],
  "actions": [
    {
      "kind": "write",
      "path": "PRODUCT.md",
      "contents": "# Product\n..."
    },
    {
      "kind": "write",
      "path": "DESIGN.md",
      "contents": "# Design system\n..."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"teach-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `summary`: object; all four keys required (use `null` if a value cannot be
  inferred — never omit a key).
- `summary.spacingScale`: array of integers in ascending order, or `null`.
- `summary.typeTiers`: array of `"label" | "value" | "display"`, or `null`.
- `findings`: required array (use `[]` when none).
- `actions`: required array; each entry has `kind: "write"`, `path`
  (repo-relative), and `contents` (full file body).
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.
- `location.line`: integer (1-based), or `null` when the finding is repo-wide.

## Severity rubric
- `fail`: A primary signal cannot be resolved (no accent at all, no type
  tiers, no spacing rhythm). The repo is too unstructured to teach from.
- `warn`: Signals are resolvable but at least one is weak (e.g. only two type
  tiers, accent without state semantics).
- `pass`: All four summary keys resolved with confidence; `findings` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable teach target=.
```

Example output:

```json
{
  "schemaVersion": "teach-report-v1",
  "verdict": "warn",
  "summary": {
    "productNoun": "project",
    "primaryAccent": "cobalt",
    "spacingScale": [4, 8, 12, 16, 24, 32],
    "typeTiers": ["label", "value"]
  },
  "findings": [
    {
      "ruleId": "teach-collapsed-tiers",
      "severity": "warn",
      "antiPatternId": null,
      "location": {
        "path": "src/components/ProjectCard.tsx",
        "line": 8
      },
      "message": "Only two type tiers detected; display tier is missing.",
      "fix": "Introduce a display tier for the primary value on each screen."
    }
  ],
  "actions": [
    {
      "kind": "write",
      "path": "PRODUCT.md",
      "contents": "# Product\n\n- Noun: project\n- Primary user: program manager\n- Top jobs: scope, status, ownership\n"
    },
    {
      "kind": "write",
      "path": "DESIGN.md",
      "contents": "# Design system\n\n## Type tiers\n- label: 12px, uppercase, muted\n- value: 14px, semibold, ink\n- display: 28px, bold, ink (one per viewport)\n\n## Accent\n- cobalt: action; reserved for the primary CTA.\n\n## Spacing scale\n4 / 8 / 12 / 16 / 24 / 32\n"
    }
  ]
}
```
