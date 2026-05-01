import { test } from "node:test";
import { strict as assert } from "node:assert";
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { loadSkills } from "../../src/skills/index.js";
import { loadCommands } from "../../src/commands/index.js";

test("loads three skills with frontmatter", () => {
  const skills = loadSkills(resolve("skills"));
  const ids = skills.map((s) => s.id).sort();
  assert.deepEqual(ids, ["impeccable-react", "impeccable-typescript", "impeccable-ui"]);
});

test("impeccable-ui has hydrated references and anti-patterns", () => {
  const skills = loadSkills(resolve("skills"));
  const ui = skills.find((s) => s.id === "impeccable-ui");
  assert.ok(ui);
  assert.ok(ui!.references.length >= 2);
  assert.ok(ui!.antiPatterns.length >= 2);
});

test("anti-pattern detector_rule joins to a real rule id", async () => {
  const { ALL_RULES } = await import("../../src/detector/rules/index.js");
  const ruleIds = new Set(ALL_RULES.map((r) => r.id));
  const skills = loadSkills(resolve("skills"));
  for (const s of skills) {
    for (const ap of s.antiPatterns) {
      if (!ap.detector_rule) continue;
      assert.ok(ruleIds.has(ap.detector_rule), `unknown detector_rule: ${ap.detector_rule}`);
    }
  }
});

test("loads the full command catalog", () => {
  const commands = loadCommands(resolve("commands"));
  const ids = commands.map((c) => c.id).sort();
  assert.deepEqual(ids, [
    "adapt",
    "animate",
    "audit-typescript",
    "bolder",
    "clarify",
    "colorize",
    "craft",
    "critique-ui",
    "delight",
    "distill",
    "document",
    "extract",
    "harden",
    "layout",
    "live",
    "onboard",
    "optimize",
    "overdrive",
    "polish",
    "pre-ship-gate",
    "quieter",
    "rewrite-generic",
    "shape",
    "teach",
    "typeset",
  ]);
});

const REFERENCE_SECTION_ORDER = [
  "Intent",
  "Non-negotiable rules",
  "Anti-patterns and failure cues",
  "Rewrite protocol",
  "Quick pass/fail checklist",
  "Before/after mini examples",
] as const;

const COMMAND_SECTION_ORDER = ["Purpose", "Inputs", "Procedure", "Output schema", "Severity rubric"] as const;

const CORE_PACK_SECTIONS = [
  "objective",
  "hierarchy model",
  "typography roles",
  "spacing rhythm",
  "CTA strategy",
  "anti-pattern watchlist",
  "done criteria",
] as const;

function extractH2Headings(markdown: string): string[] {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^##\s+(.+?)\s*$/)?.[1])
    .filter((value): value is string => Boolean(value));
}

function assertOrderedSections(markdown: string, orderedSections: readonly string[], sourceLabel: string): void {
  const headings = extractH2Headings(markdown);
  const positions = orderedSections.map((section) => {
    const index = headings.indexOf(section);
    assert.notEqual(index, -1, `${sourceLabel} missing required section: "${section}"`);
    return index;
  });

  for (let i = 1; i < positions.length; i++) {
    assert.ok(
      positions[i] > positions[i - 1],
      `${sourceLabel} section "${orderedSections[i]}" must appear after "${orderedSections[i - 1]}"`,
    );
  }
}

function assertNonEmptySectionBodies(markdown: string, sections: readonly string[], sourceLabel: string): void {
  for (const section of sections) {
    const rx = new RegExp(`##\\s+${section.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, "i");
    const match = markdown.match(rx);
    assert.ok(match, `${sourceLabel} missing core section: "${section}"`);
    assert.ok(match[1].trim().length > 0, `${sourceLabel} section "${section}" must be non-empty`);
  }
}

test("reference fixtures enforce required section ordering", () => {
  const validFixture = readFileSync(resolve("tests/skills/fixtures/section-order/references/valid-reference.md"), "utf8");
  assert.doesNotThrow(() => {
    assertOrderedSections(validFixture, REFERENCE_SECTION_ORDER, "valid reference fixture");
  });

  const invalidFixture = readFileSync(resolve("tests/skills/fixtures/section-order/references/invalid-reference.md"), "utf8");
  assert.throws(() => {
    assertOrderedSections(invalidFixture, REFERENCE_SECTION_ORDER, "invalid reference fixture");
  });
});

test("skills/impeccable-ui/references follow required section ordering", () => {
  const referenceFiles = readdirSync(resolve("skills/impeccable-ui/references")).filter((file) => file.endsWith(".md"));
  for (const file of referenceFiles) {
    const sourcePath = resolve("skills/impeccable-ui/references", file);
    const markdown = readFileSync(sourcePath, "utf8");
    assertOrderedSections(markdown, REFERENCE_SECTION_ORDER, `reference ${file}`);
  }
});

test("command fixtures enforce required section ordering", () => {
  const validFixture = readFileSync(resolve("tests/skills/fixtures/section-order/commands/valid-command.md"), "utf8");
  assert.doesNotThrow(() => {
    assertOrderedSections(validFixture, COMMAND_SECTION_ORDER, "valid command fixture");
  });

  const invalidFixture = readFileSync(resolve("tests/skills/fixtures/section-order/commands/invalid-command.md"), "utf8");
  assert.throws(() => {
    assertOrderedSections(invalidFixture, COMMAND_SECTION_ORDER, "invalid command fixture");
  });
});

test("commands/*.md follow required section ordering", () => {
  const commandFiles = readdirSync(resolve("commands")).filter((file) => file.endsWith(".md") && !file.startsWith("_"));
  for (const file of commandFiles) {
    const sourcePath = resolve("commands", file);
    const markdown = readFileSync(sourcePath, "utf8");
    assertOrderedSections(markdown, COMMAND_SECTION_ORDER, `command ${file}`);
  }
});

test("pack fixtures enforce core section existence and non-empty content", () => {
  const validFixture = readFileSync(resolve("tests/skills/fixtures/section-order/packs/valid-pack.md"), "utf8");
  assert.doesNotThrow(() => {
    assertNonEmptySectionBodies(validFixture, CORE_PACK_SECTIONS, "valid pack fixture");
  });

  const invalidFixture = readFileSync(resolve("tests/skills/fixtures/section-order/packs/invalid-pack.md"), "utf8");
  assert.throws(() => {
    assertNonEmptySectionBodies(invalidFixture, CORE_PACK_SECTIONS, "invalid pack fixture");
  });
});

test("dashboard/form-flow/landing packs include non-empty core sections", () => {
  const packFiles = ["dashboard-pack.md", "form-flow-pack.md", "landing-pack.md"];
  for (const file of packFiles) {
    const sourcePath = resolve("skills/impeccable-ui", file);
    const markdown = readFileSync(sourcePath, "utf8");
    assertNonEmptySectionBodies(markdown, CORE_PACK_SECTIONS, `pack ${file}`);
  }
});

test("verify-skills reports unresolved uses_references with command path, missing id, and known ids", () => {
  const fixtureRoot = mkdtempSync(resolve(tmpdir(), "verify-skills-fixture-"));
  try {
    mkdirSync(resolve(fixtureRoot, "skills/demo/references"), { recursive: true });
    mkdirSync(resolve(fixtureRoot, "commands"), { recursive: true });

    writeFileSync(
      resolve(fixtureRoot, "skills/demo/SKILL.md"),
      `---
id: demo
name: Demo Skill
version: 1.0.0
summary: demo
voice: directive
applies_to: []
references:
  - known-ref
anti_patterns: []
commands: []
---

# Demo
`,
    );

    writeFileSync(
      resolve(fixtureRoot, "skills/demo/references/known-ref.md"),
      `---
id: known-ref
parent: demo
summary: known
---

# Known ref

## Intent
x
## Non-negotiable rules
x
## Anti-patterns and failure cues
x
## Rewrite protocol
x
## Quick pass/fail checklist
x
## Before/after mini examples
x
`,
    );

    writeFileSync(
      resolve(fixtureRoot, "commands/bad-command.md"),
      `---
id: bad-command
name: Bad command
version: 1.0.0
summary: bad
uses_skills:
  - demo
uses_references:
  - missing-ref
output_schema: {}
---

# Bad command
## Purpose
x
## Inputs
x
## Procedure
x
## Output schema
x
## Severity rubric
x
## Example invocation + example output
x
`,
    );

    const tsxLoader = resolve("node_modules/tsx/dist/loader.mjs");
    const verifyScript = resolve("scripts/verify-skills.ts");
    const result = spawnSync("node", ["--import", tsxLoader, verifyScript], {
      cwd: fixtureRoot,
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /commands\/bad-command\.md/);
    assert.match(result.stderr, /missing-ref/);
    assert.match(result.stderr, /known-ref/);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
