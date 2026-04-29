# impeccable-react

> Stop shipping AI-generic UI. A skills bundle, command system, and detector for Claude Code, Codex, Cursor, and GitHub Copilot.

`impeccable-react` is three things in one repository:

1. **Skills** — portable instruction bundles that codify what makes UI feel hand-built (typography, color, spacing, anti-patterns).
2. **Commands** — a `/impeccable …` command catalog (critique, audit, polish, rewrite, gate) you can drop into your AI tool of choice.
3. **Detector** — an `npx impeccable scan` CLI that finds the same anti-patterns in real source code.

The premise: AI assistants regenerate the same template UI by default. This is the gate that rejects it.

---

## 30-second install

| Tool | Install |
| --- | --- |
| Claude Code | `npx impeccable render claude-code > .claude.tar && tar -xf .claude.tar` (or copy `dist/claude-code/` into your repo) |
| Codex CLI | Copy `dist/codex/AGENTS.md` to your project root |
| Cursor | _coming next slice_ |
| GitHub Copilot | _coming next slice_ |

Two adapters ship in this MVP slice (Claude Code, Codex). Cursor and Copilot land in the next iteration.

---

## Try the detector

```bash
npx impeccable scan ./src
npx impeccable scan ./src/Card.tsx --reporter json
npx impeccable scan ./src --rule ui-uniform-radius --strict
npx impeccable scan ./src --fast
```

Exit code is non-zero when any `fail` finding is present (or any `warn` with `--strict`). Wire it into CI.

---

## What ships in this slice

- 3 skills: `impeccable-ui`, `impeccable-react`, `impeccable-typescript` — each with a `SKILL.md` and frontmatter.
- 3 detector rules: `ui-uniform-radius`, `ui-generic-saas-card`, `ts-no-any`.
- 2 reporters: `human`, `json`.
- 2 target adapters: `claude-code`, `codex`.
- 4 starter commands: `critique-ui`, `pre-ship-gate`, `rewrite-generic`, `audit-typescript`.
- A schema verifier (`npm run verify`) that fails CI on broken skill ↔ rule joins.

The full catalog (20+ commands, 13+ rules, 7 references, 6 anti-patterns, 4 adapters) is on the roadmap.

---

## Author your own

- `docs/` (forthcoming) — guides for authoring skills, commands, rules.
- The schema for skill frontmatter lives in `src/skills/schema.ts`.
- The schema for command frontmatter lives in `src/commands/schema.ts`.
- The interface for detector rules lives in `src/detector/rules/types.ts`.

Every detector rule that flags an anti-pattern must reference a markdown file under `skills/<id>/anti-patterns/`. CI enforces this — there is no silent drift between what the AI is told and what the linter checks.

---

## License

MIT.
