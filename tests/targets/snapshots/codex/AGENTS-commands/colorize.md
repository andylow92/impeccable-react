# Replace generic Tailwind defaults with an earned palette

# /impeccable colorize

## Purpose
Detect and replace AI-default color palettes (raw Tailwind defaults, pure
black/white, decorative gradients, undifferentiated semantic dots) with an
earned palette built around ink, paper, one signature accent, and explicit
semantic states.

## Inputs
- `target` (required, `path`): component, screen, or directory.

## Procedure
1. Read `DESIGN.md` if present to anchor the existing palette tokens. If
   absent, treat the audit as the seed for one and flag the absence.
2. Scan the target for raw Tailwind default accent literals
   (`bg-(blue|red|green|purple|pink|indigo|yellow|emerald)-(400|500|600)`,
   `text-*-500`, `border-*-500`). Each is a `fail`-level finding.
3. Scan for pure-white / pure-black body styling (`bg-white`, `text-black`,
   hex `#FFFFFF` / `#000000` literals). Each is a `warn`-level finding;
   recommend off-paper / off-ink replacements.
4. Scan for decorative gradients (`bg-gradient-to-* from-*-500
   to-*-500`). If the gradient does not encode a state (progress,
   severity), flag as `warn` and recommend removal.
5. Scan for multiple accents on the same viewport. If more than one accent
   appears without distinct semantic encoding, flag as `warn` per
   `palette-design`.
6. Scan for pure-gray neutrals (`bg-gray-*`, `text-zinc-*`, `text-slate-*`
   used as the only neutral scale). Recommend a tinted neutral ramp.
7. For each finding, propose a concrete replacement that maps to a project
   token (e.g. `bg-blue-500` → `bg-action`; `bg-white` → `bg-paper`).
8. Cross-check every text/background pair against the contrast thresholds
   in `color-contrast`. Carry forward any contrast violation as a
   companion finding.
9. Emit JSON that exactly matches the output schema.

## Output schema
Return **only** JSON with this exact shape and stable key order:

```json
{
  "schemaVersion": "colorize-report-v1",
  "verdict": "pass",
  "changes": [
    {
      "category": "tailwind-default",
      "ruleId": "colorize-tailwind-default-accent",
      "severity": "fail",
      "antiPatternId": "tailwind-default-palette",
      "location": { "path": "src/components/Button.tsx", "line": 12 },
      "message": "bg-blue-500 ships as the primary action accent.",
      "fix": "Define theme.colors.cobalt in tailwind.config.js (OKLCH) and replace bg-blue-500 with bg-cobalt."
    }
  ]
}
```

Contract requirements:
- `schemaVersion`: enum, must be `"colorize-report-v1"`.
- `verdict`: enum, one of `"pass" | "warn" | "fail"`.
- `changes`: required array (use `[]` when none).
- `category`: enum, one of `"tailwind-default" | "pure-ink-paper" |
  "decorative-gradient" | "competing-accents" | "pure-gray-neutrals" |
  "missing-semantic" | "contrast"`.
- `severity`: enum, one of `"warn" | "fail"`.
- `antiPatternId`: string or `null`. Set to `"tailwind-default-palette"`
  whenever the category is `"tailwind-default"` or
  `"decorative-gradient"`.
- `location.line`: integer (1-based).
- `fix`: must propose a concrete replacement token; never "consider a
  different color" without a target.

## Severity rubric
- `fail`: At least one raw Tailwind default literal ships as a brand or
  primary-action accent **or** at least one body-text pair fails the
  `color-contrast` 4.5:1 floor.
- `warn`: Pure black/white body styling, decorative gradients, competing
  accents without semantics, or pure-gray neutrals without a tinted
  ramp.
- `pass`: `changes` is `[]`.

Calibration rule: A decorative gradient shipped on the primary CTA, hero,
or app shell auto-classifies the run as `fail`, even if the gradient
elsewhere is acceptable.

## Example invocation + example output
Invocation:

```text
/impeccable colorize target=src/screens/Welcome.tsx
```

Example output:

```json
{
  "schemaVersion": "colorize-report-v1",
  "verdict": "fail",
  "changes": [
    {
      "category": "decorative-gradient",
      "ruleId": "colorize-decorative-gradient",
      "severity": "fail",
      "antiPatternId": "tailwind-default-palette",
      "location": { "path": "src/screens/Welcome.tsx", "line": 8 },
      "message": "Hero header uses bg-gradient-to-r from-purple-500 to-pink-500; no state encoded.",
      "fix": "Replace with bg-paper text-ink. Reserve gradients for state encodings (progress, severity)."
    },
    {
      "category": "tailwind-default",
      "ruleId": "colorize-tailwind-default-accent",
      "severity": "fail",
      "antiPatternId": "tailwind-default-palette",
      "location": { "path": "src/screens/Welcome.tsx", "line": 22 },
      "message": "Primary CTA uses bg-blue-500; raw Tailwind default ships as brand identity.",
      "fix": "Define cobalt = oklch(58% 0.18 255) in tailwind.config.js and replace bg-blue-500 with bg-cobalt."
    },
    {
      "category": "pure-ink-paper",
      "ruleId": "colorize-pure-paper",
      "severity": "warn",
      "antiPatternId": null,
      "location": { "path": "src/screens/Welcome.tsx", "line": 4 },
      "message": "Body uses bg-white text-black; no off-ink/off-paper chosen.",
      "fix": "Replace with bg-paper text-ink (e.g. paper = oklch(97% 0.01 80), ink = oklch(22% 0.03 270))."
    }
  ]
}
```
