# impeccable-react

> Stop shipping AI-generic UI. A skills bundle, command system, and detector for Claude Code and Codex (Cursor and Copilot adapters: planned).

`impeccable-react` is three things in one repository:

1. **Skills** — portable instruction bundles that codify what makes UI feel hand-built (typography, color, spacing, anti-patterns).
2. **Commands** — a `/impeccable …` command catalog (critique, audit, rewrite, gate) you can drop into your AI tool of choice.
3. **Detector** — an `npx impeccable scan` CLI that finds the same anti-patterns in real source code.

The premise: AI assistants regenerate the same template UI by default. This is the gate that rejects it.

---

## Install

```bash
npm install impeccable-react
```

That gives you the `impeccable` CLI plus a built `dist/` tree containing the per-target bundles.

| Target | Install |
| --- | --- |
| Claude Code | `cp -r node_modules/impeccable-react/dist/claude-code/.claude .` |
| Codex CLI | `cp node_modules/impeccable-react/dist/codex/AGENTS.md .`<br>`cp -r node_modules/impeccable-react/dist/codex/AGENTS-commands .` |
| Cursor | _planned (see Known limitations)_ |
| GitHub Copilot | _planned (see Known limitations)_ |

To inspect what would be installed without copying anything:

```bash
npx impeccable render claude-code   # prints every generated file with a "# ===== <path> =====" header
npx impeccable render codex
```

If you cloned the repo and want to regenerate `dist/` from source, run `npm run build`.

---

## Detector usage

```bash
npx impeccable scan ./src                              # scan a directory
npx impeccable scan ./src/Card.tsx                     # scan a single file
npx impeccable scan ./src --reporter json              # JSON output (schema: impeccable-scan-report-v1)
npx impeccable scan ./src --rule ui-uniform-radius     # restrict to one rule (repeatable)
npx impeccable scan ./src --strict                     # warn-level findings also fail
npx impeccable scan ./src --fast                       # skip slow rules (none are slow yet)
npx impeccable scan ./src --output report.json --reporter json
npx impeccable list rules
npx impeccable list commands
npx impeccable list skills
npx impeccable list targets
npx impeccable explain ui-generic-saas-card            # prints the anti-pattern doc
```

Exit codes: `0` if no `fail` findings (and no `warn` with `--strict`). `1` if findings exceed the threshold. `2` for invalid invocation. Wire it into CI.

---

## What ships today

- Upgraded skill quality: the shipped skills (`impeccable-ui`, `impeccable-react`, `impeccable-typescript`) are packaged with stricter frontmatter contracts and cleaner handoffs between guidance, references, and anti-pattern docs.
- Upgraded reference + anti-pattern quality: detector-backed anti-pattern documentation is treated as first-class content, so authored guidance and linted behavior stay aligned instead of drifting.
- Stricter command contracts: command metadata is validated more aggressively so command slugs and `uses_skills` / `uses_references` links resolve deterministically.
- 3 detector rules: `ui-uniform-radius`, `ui-generic-saas-card` (confidence-scored), `ts-no-any`.
- 2 reporters: `human` (default), `json`.
- 2 target adapters: `claude-code`, `codex`.
- 4 starter commands: `critique-ui`, `pre-ship-gate`, `rewrite-generic`, `audit-typescript`.
- A schema verifier (`npm run verify`) that fails CI on:
  - broken skill ↔ rule ↔ anti-pattern joins (a rule with no anti-pattern doc is an error)
  - command slugs that aren't `"/word"` or `"/word subword..."` (kebab tokens, single spaces)
  - `uses_skills` / `uses_references` ids that don't resolve
- Adapter snapshot tests that fail when generated output drifts (`UPDATE_SNAPSHOTS=1 npm test` to refresh).

## Skill maturity

### Production-ready guidance (now)

- Skill/frontmatter validation is enforced in CI and blocks invalid joins across skills, rules, references, and anti-pattern docs.
- The current guidance set is intended for immediate use with the shipping adapters (`claude-code`, `codex`) and detector rules.
- Command contracts are strict enough to rely on in team workflows (stable slash command shape + resolvable skill/reference links).

### Roadmap items (later, pre-adapter expansion)

- Expand guidance depth first: add more rules, references, and anti-pattern docs before broadening adapter surface area.
- Add ecosystem features that strengthen feedback loops (for example, SARIF output, config-file controls, and richer rule coverage).
- Keep adapter status unchanged in this sprint: no Cursor/Copilot expansion until the guidance corpus and detector contract are further matured.

---

## Known limitations (MVP)

- **Adapters: Claude Code + Codex only.** No Cursor (`.cursor/rules/*.mdc`) or Copilot (`.github/copilot-instructions.md`) emission yet. The adapter interface in `src/targets/types.ts` is what new targets implement.
- **Rule coverage is small (3 rules).** No coverage yet for: shadow uniformity, decorative gradients, pill-and-ghost stacks, contrast tokens, fetch-in-component, business-rule-in-jsx, effect-derived-state. They're modeled in the skill docs but not yet enforced by the detector.
- **Reporters: human + JSON only.** No SARIF reporter (planned, would unblock GitHub code-scanning integration).
- **Inputs: file or directory only.** No URL mode (`--url <url>` returns "not implemented"). No `.gitignore` parsing — the walker hardcodes a small skip list (`node_modules`, `dist`, `.git`, etc.).
- **Languages: TSX, TS, JSX, JS only.** No standalone HTML or CSS parsing. CSS rules live in classNames; if your styling isn't in classNames, the rules can't see it.
- **No `.impeccablerc.json` config.** Severity overrides and per-rule disabling go through `--rule` only. Inline ignores aren't implemented.
- **No autofix.** Findings include a `fix.description` field, but no rule emits a code patch.

The full catalog (20+ commands, 13+ rules, 7+ references, 6+ anti-patterns, 4 adapters, SARIF reporter, URL mode, configfile) is on the roadmap. Each item below the line above is a small, isolated PR away.

---

## Authoring

- The schema for skill frontmatter lives in `src/skills/schema.ts`.
- The schema for command frontmatter lives in `src/commands/schema.ts`.
- The interface for detector rules lives in `src/detector/rules/types.ts`.

Every detector rule that flags an anti-pattern must reference a markdown file under `skills/<id>/anti-patterns/`. CI enforces this — there is no silent drift between what the AI is told and what the linter checks.

---

## License

MIT.
