import { test } from "node:test";
import { strict as assert } from "node:assert";
import { resolve } from "node:path";
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

test("loads four starter commands", () => {
  const commands = loadCommands(resolve("commands"));
  const ids = commands.map((c) => c.id).sort();
  assert.deepEqual(ids, ["audit-typescript", "critique-ui", "pre-ship-gate", "rewrite-generic"]);
});
