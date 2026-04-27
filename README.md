# impeccable-react

A React + TypeScript starter that **enforces** craft. Most AI-generated UIs
collapse into the same generic SaaS template — rounded cards, soft shadows,
gray-on-gray text, decorative gradients. This repo is built to reject that
output, in the rules, in the components, and in a runtime design linter.

It is opinionated on purpose. If you want an unopinionated starter, this is
the wrong one.

---

## What this repo gives you

1. **Skills (rule sets)** — enforcement-mode markdown that reads like a gate,
   not a guide. Drop them into Cursor, Copilot, Codex, or Claude Code as the
   instruction layer.
   - [`skills/design.md`](./skills/design.md) — anti-generic UI rules with a
     pre-flight checklist, fail conditions, and a rewrite protocol.
   - [`skills/typescript.md`](./skills/typescript.md) — boundary validation,
     no `any`, schema-as-type discipline.
   - [`skills/react.md`](./skills/react.md) — domain / lib / ui layer
     boundaries and component composition rules.
2. **A runtime design linter** — [`src/lib/designGuard.ts`](./src/lib/designGuard.ts)
   walks the rendered DOM and flags template-feel UI: low contrast, uniform
   radii, uniform shadows, too-many-similar containers, untokenized spacing.
3. **Components built around decisions, not decoration** — `Card`, `Button`,
   and `ProgressSignal` each carry comments explaining the generic pattern
   they avoid and the design decision made instead.
4. **A side-by-side comparison** — [`src/examples/generic-vs-impeccable/`](./src/examples/generic-vs-impeccable/)
   ships both a deliberately-bad and a deliberately-good version of the same
   card. Same data. Opposite postures.
5. **A realistic visual test page** — `DashboardScreen` renders multiple
   projects with mixed risk levels, so the components are stressed in
   context, not in isolation.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

Routes (hash-based):

- `#dashboard` — the realistic multi-project view (default).
- `#project` — a single-card focus view.
- `#examples` — generic-vs-impeccable side-by-side.

In dev mode, `DashboardScreen` automatically runs `designGuard()` on the
rendered tree and prints any findings to the console.

---

## Design Smell Test

Read this before you ship any UI. If you tick any of the failure rows, you do
not have a finished UI — you have a draft.

| Question | Pass | Fail |
|---|---|---|
| Could this be the front page of a Tailwind UI kit? | No, it has identity. | **Yes — reject.** |
| In 3 seconds, can a stranger tell what is most important? | Yes, hierarchy is obvious. | **No — redesign.** |
| Does every container share the same radius and shadow? | Two intentional radii max. | **Yes — reject.** |
| Is primary data rendered in muted gray? | Bold ink on light surface. | **Yes — reject.** |
| Does the progress UI name the owner and the blocker? | Yes — accountability is rendered. | **No — replace it.** |
| Does color encode state (action / risk / authority)? | Yes — color is functional. | **No — strip the color.** |
| Are CTAs distinguished by contrast, not just label? | Yes — primary out-contrasts secondary. | **No — re-rank them.** |

If any row fails, jump to `skills/design.md` § 4 ("Rewrite instruction") and
restart the screen using the strip → rank → tier → contrast → shape → shadow
sequence. Patching does not work; the generic look is in the structure, not
the styling.

---

## How to use this with AI tools

The skills in `/skills/` are written to be **consumed by AI coding tools as
the instruction layer**. The rule of thumb: feed the relevant skill to the
tool *before* you ask it to generate or change code, not after.

### Claude Code

Claude Code reads `CLAUDE.md` automatically and supports referencing other
files via `@` mentions. Two recommended patterns:

**1. Project-level memory.** Create or append to `CLAUDE.md` at the repo root:

```markdown
# Project conventions

When generating React/TS code in this repo, you must follow:
- @skills/design.md  (UI quality gate, fail conditions, rewrite protocol)
- @skills/typescript.md  (no `any`, schema-validated boundaries)
- @skills/react.md  (domain / lib / ui layer boundaries)

Before declaring a UI task done, run `designGuard()` from
`src/lib/designGuard.ts` against the rendered tree and resolve every finding.
```

**2. Per-task reference.** When asking Claude Code to build or refactor UI,
prefix your message with `@skills/design.md @skills/react.md` so the rules
are loaded into context for that turn.

You can also wire the skills into a slash command (e.g. `/review-ui` that
runs the checklist) or a SessionStart hook. See
[Claude Code docs](https://docs.claude.com/en/docs/claude-code) for setup.

### GitHub Copilot

Copilot honors per-repo instructions in `.github/copilot-instructions.md`.
Add a file like:

```markdown
# Copilot instructions for impeccable-react

When generating UI code:
- Treat `skills/design.md` as a hard gate. Reject completions that fail
  any condition in its "Fail conditions" section.
- Use the components in `src/ui/components/` instead of inventing new
  rounded-card primitives.
- Never declare domain types in the UI layer. Import them from `src/domain/`.
- All external data must be parsed with the matching Zod schema before it
  reaches a component.

Anti-patterns to avoid (auto-reject):
- `rounded-2xl` / `rounded-3xl` everywhere.
- `text-gray-400` / `text-gray-500` on primary data.
- Pill buttons (`rounded-full`).
- Decorative gradient strips at the top of cards.
- Progress bars without an owner or blocker label.
```

Copilot Chat will pick this up automatically. For Copilot in the editor,
keep `skills/design.md` open in a tab while working — Copilot uses open
files as context.

### OpenAI Codex / Codex CLI

Codex reads `AGENTS.md` (or `.codex/AGENTS.md`) as the project instruction
layer. Add:

```markdown
# Codex agent instructions

Read these before writing code in this repo:
- `skills/design.md` — UI quality gate. Treat its "Fail conditions" as
  reject rules.
- `skills/typescript.md` — TypeScript discipline.
- `skills/react.md` — layer boundaries.

Workflow:
1. Identify which skill(s) the task touches.
2. Generate code that complies with every applicable rule.
3. For UI changes, run `npm run dev` and confirm `designGuard()` reports
   zero findings (DashboardScreen prints them automatically in dev).
4. Run `npm run typecheck` and `npm run lint` before declaring done.
```

For Codex CLI specifically, you can also pass `--instructions skills/design.md`
on UI tasks to force the gate into context for that run.

### Cursor

Cursor reads `.cursorrules` (legacy) or `.cursor/rules/*.mdc` (current). Add a
rule file pointing at the skills:

```mdc
---
description: UI quality gate
globs: ["src/**/*.tsx", "src/**/*.ts"]
alwaysApply: true
---

Before generating or editing UI code, follow:
- skills/design.md (fail conditions are blocking)
- skills/typescript.md
- skills/react.md
```

---

## Stack

- React 18 + TypeScript (strict, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`)
- Vite
- Tailwind CSS (custom token scale — `ink`, `cobalt`, `signal`, `paper`,
  `rhythm`, `gutter`, `rounded-sharp`, `rounded-panel`)
- Zod for boundary validation

## Project structure

```txt
src/
  domain/                          # Zod schemas + pure rules. No React, no I/O.
  lib/                             # API client, formatters, designGuard.
  ui/
    components/                    # Card (slot composition), Button, ProgressSignal
    screens/                       # ProjectScreen, DashboardScreen, ExamplesScreen
  examples/
    generic-vs-impeccable/         # Before / after reference
skills/
  design.md                        # UI gate
  typescript.md                    # TS discipline
  react.md                         # Architecture boundaries
```

## Scripts

```bash
npm run dev         # Vite dev server
npm run build       # tsc -b && vite build
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint (max-warnings 0)
```

## designGuard at a glance

```ts
import { designGuard, reportToConsole } from '@/lib/designGuard';

useEffect(() => {
  if (import.meta.env.DEV && rootRef.current) {
    reportToConsole(designGuard(rootRef.current));
  }
}, [data]);
```

It returns a structured report of findings. Each finding has a rule, a
severity (`warn` | `fail`), a message, and (where applicable) the offending
element. Wire it into a Storybook addon, a CI smoke test, or a dev panel —
your call.

## Philosophy

This repo prefers direct rules over diplomatic ones. "Avoid uniform radii" is
a guideline. "If every container has the same border-radius, the UI is
rejected" is a rule. Only the second one survives contact with an LLM.

The components, the linter, and the skills are all aligned on the same
posture: **teach, enforce, and prove**. If the proof breaks (a generic UI
slips through), the linter or a rule is missing — patch it, do not loosen it.
