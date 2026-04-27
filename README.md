# impeccable-react

Opinionated React + TypeScript starter for teams that want UI quality gates, not vague style advice.

## What this repo does
- **Teaches** with explicit skills (`skills/*.md`).
- **Enforces** with lightweight design heuristics (`lib/designGuard.ts`).
- **Proves** quality with side-by-side generic vs intentional examples and a visual test page.

## Why most AI UIs look generic
- Same radius and shadow on every container.
- Weak contrast that hides hierarchy.
- Decorative progress bars that communicate no ownership or risk.
- Flat card grids where nothing is clearly primary.

This starter rejects those defaults with hard checks and compositional patterns.

## Design Smell Test (fail fast)
- If it looks like a template card stack → **fail**.
- If hierarchy is unclear in 3 seconds → **fail**.
- If radius/shadow is uniform everywhere → **fail**.
- If key text contrast is weak → **fail**.

## Before vs After
### Generic (bad)
- Uniform cards, muted text, decorative progress fill.
- No clear reading order.

### Impeccable (good)
- Structural zones: context, decision metrics, execution state, action rail.
- High-contrast typography with semantic accents.
- Progress shown as accountable status rows (owner + state).

See `examples/generic-vs-impeccable/README.md` and `src/ui/screens/GenericVsImpeccable.tsx`.

## Enforcement systems
### 1) Skills (human + AI rules)
- `skills/design.md`: shipping checklist, fail conditions, rewrite instruction.
- `skills/typescript.md`: strict TS discipline and examples.
- `skills/react.md`: architecture boundaries and anti-patterns.

### 2) Design Guard (heuristic linting)
`lib/designGuard.ts` provides checks for:
- contrast ratio thresholds,
- spacing consistency,
- border-radius overuse,
- template-like container repetition.

The main screen renders guard results so generic UI signals are visible during development.

## Architecture
```txt
src/
  domain/   # schemas + domain contracts
  lib/      # typed API + utilities
  ui/
    components/
    screens/
lib/
  designGuard.ts # design heuristics used as lint-like checks
skills/
  design.md
  react.md
  typescript.md
examples/
  generic-vs-impeccable/
```

## TypeScript discipline
- `strict` + `noImplicitAny` + exact optional handling in `tsconfig.app.json`.
- ESLint rule rejects explicit `any`.
- External data is parsed by Zod before entering UI.

## How to use this with AI tools (Codex, Cursor)
1. Start every generation with `skills/design.md`, `skills/typescript.md`, and `skills/react.md`.
2. Ask the AI to run the smell test and fail conditions explicitly before final output.
3. Require component comments that state:
   - what generic pattern was avoided,
   - what intentional design decision replaced it.
4. Run or review `Design Guard` warnings; treat errors as block conditions.

## Run
```bash
npm install
npm run dev
```
