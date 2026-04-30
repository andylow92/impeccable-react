---
id: live
title: Iterate on a rendered URL using the full Impeccable rule set
slug: /impeccable live
inputs:
  - name: url
    kind: url
    required: true
    description: A URL pointing to a rendered page, screen, or component preview.
  - name: focus
    kind: string
    required: false
    description: Optional comma-separated subset of dimensions (typography, color, spacing, motion, interaction, responsive, writing).
outputs:
  - kind: report
    schema: live-report-v1
uses_skills:
  - impeccable-ui
uses_references:
  - typography
  - color-contrast
  - spatial-design
  - motion-design
  - interaction-design
  - responsive-design
  - ux-writing
severity_threshold: warn
---

# /impeccable live

## Purpose
Run the Impeccable rule set against a rendered URL — a deployed preview, a
Storybook entry, or a localhost route — instead of source files. Use this
when source mapping is ambiguous or when verifying the shipped output.

## Inputs
- `url` (required, `url`): rendered preview address.
- `focus` (optional, `string`): comma-separated subset of
  `typography,color,spacing,motion,interaction,responsive,writing`.

## Procedure
1. Fetch the target URL and capture: rendered DOM, computed styles for
   every interactive element, accent and contrast pairs, type tier sizes
   and weights, breakpoint behavior at the smallest supported viewport.
2. For each in-scope dimension, run the corresponding fixer rule set
   (`typeset`, `color-contrast`, `layout`, `animate`, `interaction-design`,
   `adapt`, `clarify`).
3. Resolve each finding to a DOM selector. Resolve `path` only when
   source-map resolution is reliable; otherwise emit `path: null` and the
   selector in `selector`.
4. Emit JSON that exactly matches the output schema. The output is a
   report — `live` does not produce code patches.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "live-report-v1",
  "verdict": "pass",
  "url": "https://preview.example.com/billing",
  "findings": [
    {
      "ruleId": "live-low-contrast-body",
      "severity": "fail",
      "antiPatternId": null,
      "selector": "main .invoice-row .amount",
      "location": { "path": null, "line": null },
      "message": "Body text contrast 2.8:1 fails the 4.5:1 minimum.",
      "fix": "Replace text-gray-400 with text-gray-700 (~7.5:1)."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"live-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `url`: required non-empty string echoing the input.
- `findings`: required array (use `[]` when none).
- `selector`: required non-empty CSS selector or XPath string.
- `location.path`: string path or `null`.
- `location.line`: integer (1-based) or `null`.
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`.

## Severity rubric
- `fail`: Any rule that fails its source-mode counterpart fails here too
  (e.g. body contrast < 4.5:1, missing focus-visible, sub-44 touch target,
  body text below the 14px floor at any breakpoint).
- `warn`: Any rule that warns in its source-mode counterpart warns here.
- `pass`: `findings` is `[]`.

## Example invocation + example output
Invocation:

```text
/impeccable live url=https://preview.example.com/billing focus=color,interaction
```

Example output:

```json
{
  "schemaVersion": "live-report-v1",
  "verdict": "fail",
  "url": "https://preview.example.com/billing",
  "findings": [
    {
      "ruleId": "live-missing-focus-visible",
      "severity": "fail",
      "antiPatternId": null,
      "selector": "main .invoice-row a.action",
      "location": { "path": null, "line": null },
      "message": "Action link has no visible focus-visible style.",
      "fix": "Add a focus-visible ring at >=3:1 contrast against the row background."
    }
  ]
}
```
